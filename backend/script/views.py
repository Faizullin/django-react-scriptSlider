from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions,generics, filters
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from rest_framework_simplejwt.authentication import  JWTAuthentication
from io import BytesIO
from .models import Script, AuthKey
from script_page.models import ScriptPage
from .serializers import *
from .DOCXParser import DOCXParser
from django.db import transaction, IntegrityError
from .tasks import send_data_to_ws
from django.template.loader import render_to_string
from .permissions import AuthKeyPermission, IsOwnerAccessPermission, get_and_update_authKey_token

class ScriptListView(generics.ListAPIView):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)
    def get_queryset(self):
        qs = super().get_queryset() 
        user = self.request.user
        return qs.filter(owner = user)

class ScriptDetailView(generics.RetrieveAPIView):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated, IsOwnerAccessPermission)
    def get_context_data(self, **kwargs):
        context = super(ScriptDetailView, self).get_context_data(**kwargs)
        return context
    
class ScriptCreateView(APIView):
    serializer_class = ScriptSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        up_file = request.FILES.get('file')
        if(up_file is not None):
            return self.post_process_with_file(request, *args, **kwargs)
        else:
            return self.post_process_with_script(request, *args, **kwargs)

    def post_process_with_script(self, request, *args, **kwargs):
        raw_data = request.data
        script_data = ScriptSerializer(data=raw_data,context={'request': request})
        if script_data.is_valid():
            return Response(script_data.data)
        return Response(script_data.errors, status=400)
        # validator = FileExtensionValidator(allowed_extensions=valid_extensions)
        # try:
        #     validator(up_file)
        # except ValidationError as e:
        #     return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                script = Script.objects.create(title = script_data['name'], owner=self.request.user)
                for i,script_page_data in enumerate(script_data['pages']):
                    ScriptPage.objects.create(title = script_page_data['title'], content=script_page_data['content'], script = script, index = i + 1)                  
        except Exception as err:
            return Response('IntegrityError'+str(err), status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(ScriptSerializer(script).data, status.HTTP_201_CREATED)
        
    
    def post_process_with_file(self, request, *args, **kwargs):
        up_file = request.FILES.get('file')
        valid_extensions = ['.docx','docx']
        validator = FileExtensionValidator(allowed_extensions=valid_extensions)
        try:
            validator(up_file)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        document = None
        try:
            document = DOCXParser(BytesIO(up_file.read()))
        except:
            return Response({'error': 'Failed to extract text from file: ' + e.message}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            with transaction.atomic():
                script = Script.objects.create(title = up_file.name, owner=self.request.user)
                data = document.get_content_by_sections()
                for i,(title, content) in enumerate(data):
                    ScriptPage.objects.create(title = title, content=content, script = script, index = i + 1)                  
        except Exception as err:
            return Response('IntegrityError'+str(err), status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(ScriptSerializer(script).data, status.HTTP_201_CREATED)
    
class ScriptEditView(APIView):
    serializer_class = ScriptSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, pk):
        return get_object_or_404(Script, pk=pk)

    def patch(self, request, pk, *args, **kwargs):
        script = self.get_object(pk)
        up_file = request.FILES.get('file')
        if(up_file is not None):
            return self.post_process_with_file(request, script, *args, **kwargs)
        else:
            return self.post_process_with_script(request, script, *args, **kwargs)
   
    def post_process_with_script(self, request, obj, *args, **kwargs):
        raw_data = request.data
        script_data = ScriptSerializer(data=raw_data,context={'request': request})
        if script_data.is_valid():
            return Response(script_data.data)
        return Response(script_data.errors, status=400)
        # validator = FileExtensionValidator(allowed_extensions=valid_extensions)
        # try:
        #     validator(up_file)
        # except ValidationError as e:
        #     return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                script = Script.objects.create(title = script_data['name'], owner=self.request.user)
                for i,script_page_data in enumerate(script_data['pages']):
                    ScriptPage.objects.create(title = script_page_data['title'], content=script_page_data['content'], script = script, index = i + 1)                  
        except Exception as err:
            return Response('IntegrityError'+str(err), status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(ScriptSerializer(script).data, status.HTTP_201_CREATED)
    
    def post_process_with_file(self, request, obj, *args, **kwargs):
        up_file = request.FILES.get('file')
        valid_extensions = ['.docx','docx']
        validator = FileExtensionValidator(allowed_extensions=valid_extensions)
        try:
            validator(up_file)
        except ValidationError as e:
            return Response({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)
        document = None
        try:
            document = DOCXParser(BytesIO(up_file.read()))
        except:
            return Response({'error': 'Failed to extract text from file: ' + e.message}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            with transaction.atomic():
                obj.title = up_file.name
                obj.save()
                data = document.get_content_by_sections()
                for i,(title, content) in enumerate(data):
                    script_page_obj = ScriptPage.objects.get(script = obj, index = i + 1)
                    script_page_obj.title = title
                    script_page_obj.content = content
                    script_page_obj.save()
                    #obj.title = title ScriptPage.objects.create(title = title, content=content, script = script, index = i + 1) 
        except ScriptPage.DoesNotExist:
            return Response('Script Page does not exist', status.HTTP_400_BAD_REQUEST)        
        except Exception as err:
            return Response('IntegrityError'+str(err), status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(ScriptSerializer(obj).data, status.HTTP_201_CREATED)
    
class ScriptDeleteView(generics.DestroyAPIView):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated, IsOwnerAccessPermission)

class ScriptScrollTrackUrlView(APIView):
    serializer_class = ScriptSerializer
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated, IsOwnerAccessPermission)
    def get(self,request, pk):
        script = get_object_or_404(Script, pk=pk)

        authKey_token = get_and_update_authKey_token(self.request.user.pk, script.pk)

        domain_url = 'http://localhost:8000'
        ws_domain_url = 'ws://localhost:8000'
        ws_url = f'{ws_domain_url}/ws/script/{script.pk}/'
        next_page_url = f'{domain_url}/api/script/{script.pk}/presentaion/?index=next'
        path_to_file = 'script/tracker.html'

        to_paste_command = render_to_string(path_to_file, {
            'next_page_url': domain_url,
            'script_id': script.pk,
            'requestWithIndexes': True,
            'total_pages': script.script_pages.count(),
            'authKey_token': authKey_token,
        }).replace('<script>','').replace('</script>','')
        return Response(data={
            'ws_url': ws_url,
            'next_page_url': next_page_url,
            'command': to_paste_command,
            'token': ''
        })
    
class ScriptPresentaionScrollView(APIView):
    permission_classes  = [AuthKeyPermission]
    queryset = Script.objects.all()
    
    def get_queryset(self):
        return self.queryset
    
       
    def get_object(self):
        obj = get_object_or_404(Script, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self,request, pk):
        script = self.get_object()
        index = request.GET.get('index')
        if not index:
            return Response('Incorrect index',status=status.HTTP_400_BAD_REQUEST)
        if index == 'next':
            send_data_to_ws(f'chat_{script.pk}',{
                'index':'next'
            })
            return Response(data={
                'success': True
            })
        elif index == 'prev':
            send_data_to_ws(f'chat_{script.pk}',{
                'index':'prev'
            })
            return Response(data={
                'success': True
            })
        script_page = get_object_or_404(ScriptPage, index=index, script_id = script.pk)
        send_data_to_ws(f'chat_{script.pk}',{
            'index': script_page.index,
            'id': script_page.id,
        },)
        reponse_data={
            'success': True,
        }
        if request.updated_apiKey_token:
            reponse_data['apiKey_token'] = request.updated_apiKey_token
        return Response(data=reponse_data)
    
    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
        
# class IdListFilterBackend(filters.BaseFilterBackend):
#     def filter_queryset(self, request, queryset, view):
#         id_list = request.query_params.getlist('ids')
#         id_list = [int(id) for id in id_list]
#         if id_list:
#             queryset = queryset.filter(id__in=id_list)
#         return queryset
    
# class ScriptPageDetailView(generics.ListAPIView):
#     queryset = Product.objects.order_by("-created_at")
#     serializer_class = ProductSerializer
#     filter_backends = [IdListFilterBackend,DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]
#     filterset_fields = ['type','shop']
#     search_fields = ['name']
#     ordering_fields = ['created_at','name']
    

# class ProductFiltersView(generics.ListAPIView):
#     def get(self, request, *args, **kwargs):
#         shops = Shop.objects.all()
#         shops_data = ShopSerializer(shops, many=True).data
#         product_types = ProductType.objects.all()
#         product_types_data = ProductTypeSerializer(product_types, many=True, context = {'request':request}).data

#         return Response(data={
#             'product_types': product_types_data,
#             'shops': shops_data,
#         })

# class PurchaseView(generics.ListAPIView):
#     authentication_classes = [JWTAuthentication, ]
#     permission_classes = (permissions.IsAuthenticated,)
#     queryset = Purchase.objects.all()
#     serializer_class = PurchaseSerializer

#     def get_queryset(self):
#         qs = super().get_queryset() 
#         user = self.request.user
#         return qs.filter(user = user)

        
#     def post(self, request, *args, **kwargs):        
#         data = {
#             'user': request.user.id, 
#             'status': "PENDING", 
#             'products': request.data.get('products'),
#             'total_price': 0,
#         }
#         serializer = PurchaseOrderSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class IsBot(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.groups.filter(name__in=['bot']).exists()

# class PurchaseOrderByBotView(generics.ListAPIView):
#     authentication_classes = [JWTAuthentication, ]
#     permission_classes = (permissions.IsAuthenticated, IsBot)
#     serializer_class = PurchaseOrderByBotSerializer
#     def post(self, request, *args, **kwargs):        
#         data = {
#             'user': request.data.get('user'),
#             'status': "PENDING", 
#             'products': request.data.get('products'),
#             'total_price': 0,
#         }
#         serializer = PurchaseOrderByBotSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
