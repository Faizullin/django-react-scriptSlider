from rest_framework import serializers
from rest_framework.exceptions import APIException
from .models import Script
from authentication.serializers import UserSerializer
from authentication.models import User
from script_page.models import ScriptPage
from script_page.serializers import ScriptPageSerializer
from django.db import transaction
from .DOCXParser import DOCXParser
from io import BytesIO
from django.core.validators import FileExtensionValidator
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class ScriptUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email',]
        
class ScriptSerializer(serializers.ModelSerializer):
    pages_count = serializers.SerializerMethodField()
    owner = ScriptUserSerializer(read_only=True, default=serializers.CurrentUserDefault())#serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Script
        fields = ['id','title','owner','created_at','updated_at','pages_count',]
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    def get_created_at(self, obj):
        return obj.created_at.strftime('%d %B %Y')
    def get_updated_at(self, obj):
        return obj.updated_at.strftime('%d %B %Y')
    
    def create(self, validated_data):
        return Script.objects.create(**validated_data)
    
    def get_pages_count(self, obj):
        return obj.pages.count()

    def to_representation(self, instance):
        request = self.context.get('request')
        include_pages = request.GET.get('pages', None)
        if not include_pages:
            return super().to_representation(instance)

        data = super().to_representation(instance)
        data['pages'] = ScriptPageSerializer(instance.pages.all(), many=True).data
        return data
    
class ScriptPageCreateSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True)
    content = serializers.CharField(required=False, allow_blank=True)

class ScriptCreateOrUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    form_type = serializers.CharField(required=False)
    pages = ScriptPageCreateSerializer(many=True, required = False)
    title = serializers.CharField(required = False)
    file = serializers.FileField(required=False)

    class Meta:
        model=Script
        fields = ['title', 'pages', 'form_type','owner','file']

    # def validate(self, attrs):
        # request = self.context.get('request')
        # if request and request.query_params.get('validate-pages') == 'true':
        #     # Perform validation on pages relationship
        #     pages = data.get('pages', [])
        #     for page in pages:
        #         if page.script != self.instance:
        #             raise serializers.ValidationError({'detail': 'Invalid page for script'})
        # else:
        #     # Perform validation on title and description fields
        #     title = data.get('title')
        #     description = data.get('description')
        #     if not title and not description:
        #         raise serializers.ValidationError({'detail': 'At least one of title or description is required'})
        # return data
        # return super().validate(attrs)

    def create(self, validated_data):
        form_type = validated_data.pop('form_type') if ('form_type' in validated_data) else None
        request = self.context['request']
        if form_type == 'file':
            file_obj = request.FILES.get('file')
            validators = [FileExtensionValidator(['docx'])]
            for validator in validators:
                validator(file_obj)
            document = None
            try:
                document = DOCXParser(BytesIO(file_obj.read()))
                document_data = document.get_content_by_sections()
            except:
                raise APIException(_('DocumentError'))
            try:
                with transaction.atomic():
                    script = Script.objects.create(title = file_obj.name, owner=request.user)
                    for i,(title, content) in enumerate(document_data):
                        script.pages.create(title = title, content=content, index = i + 1)               
            except Exception as err:
                raise APIException(_('IntegrityError') + str(err))
        else:
            try:
                with transaction.atomic():
                    script_pages_data = validated_data.pop("pages")
                    script = Script.objects.create(title=validated_data['title'], owner = request.user)
                    for i, script_page_data in enumerate(script_pages_data):
                        script.pages.create(title = script_page_data['title'], content=script_page_data['content'], index = i + 1)                  
            except Exception as err:
                raise APIException(_('IntegrityError') + str(err))              
        return script
    
    def update(self, instance, validated_data):
        form_type = validated_data.pop('form_type') if ('form_type' in validated_data) else None
        request = self.context['request']
        if form_type == 'file':
            file_obj = request.FILES.get('file')
            validators = [FileExtensionValidator(['docx'])]
            for validator in validators:
                validator(file_obj)
            document = None
            try:
                document = DOCXParser(BytesIO(file_obj.read()))
                document_data = document.get_content_by_sections()
            except:
                raise APIException(_('DocumentError'))
            try:
                with transaction.atomic():
                    instance.title = file_obj.name
                    instance.save()
                    instance.pages.all().delete()
                    for i,(title, content) in enumerate(document_data):
                        instance.pages.create(title = title, content=content, index = i + 1)               
            except Exception as err:
                raise APIException(_('IntegrityError') + str(err))
        else:
            try:
                with transaction.atomic():
                    script_pages_data = validated_data.pop("pages")
                    instance.title = validated_data['title']
                    instance.save()
                    instance.pages.all().delete()
                    for i, script_page_data in enumerate(script_pages_data):
                        instance.pages.create(title = script_page_data['title'], content=script_page_data['content'], index = i + 1)                  
            except Exception as err:
                raise APIException(_('IntegrityError') + str(err))              

        return instance

        # form = Script.objects.create(**validated_data)
        # for i,script_page_data in enumerate(script_pages_data):
        #     script_page_data.pop('index')
        #     script_page_data.pop('id')
        #     ScriptPage.objects.create( index=i + 1, **script_page_data)
        # return form

    
#      def create(self, validated_data):
#         products_data = validated_data.pop('products')
#         product_ids = [product['id'] for product in products_data ]
#         products = Product.objects.filter(id__in = product_ids)
#         product_dict = {product.id: product for product in products}

#         if len(products_data) > 0:
#             total_price = 0
#             purchase = Purchase.objects.create(user = validated_data['user'],total_price = 0, status="PENDING")

#             for i in range(len(products_data)):
#                 product_id = products_data[i]['id']
#                 if product_id not in product_dict.keys():
#                     raise serializers.ValidationError(f"Product with id={product_id} not found")  
#             for i in range(len(products_data)):
#                 product_id = products_data[i]['id']
#                 qty = 1
#                 if 'qty' in products_data[i].keys():
#                     qty = int(products_data[i]['qty'])
#                 shop = Shop.objects.get(id = product_dict[product_id].shop_id)
#                 purchase_item = PurchaseItem.objects.create(
#                     product = product_dict[product_id],
#                     purchase = purchase,
#                     quantity = qty,
#                     price = product_dict[product_id].price,
#                     shop = shop,
#                 ) 
#                 total_price += (qty * purchase_item.price)
#             purchase.total_price = total_price
#             purchase.save()
#             return purchase
#         raise serializers.ValidationError(f"Empty products")  
#         return None

# class ScriptPageSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = ScriptPage
#         fields = ['id','title','index','content','script','created_at','updated_at']

#     image = serializers.SerializerMethodField()
        
#     created_at = serializers.SerializerMethodField()
#     updated_at = serializers.SerializerMethodField()
#     def get_created_at(self, obj):
#         return obj.created_at.strftime('%d %B %Y')
#     def get_updated_at(self, obj):
#         return obj.updated_at.strftime('%d %B %Y')


#     def create(self, validated_data):
#         products_data = validated_data.pop('products')
#         product_ids = [product['id'] for product in products_data ]
#         products = Product.objects.filter(id__in = product_ids)
#         product_dict = {product.id: product for product in products}

#         if len(products_data) > 0:
#             total_price = 0
#             purchase = Purchase.objects.create(user = validated_data['user'],total_price = 0, status="PENDING")

#             for i in range(len(products_data)):
#                 product_id = products_data[i]['id']
#                 if product_id not in product_dict.keys():
#                     raise serializers.ValidationError(f"Product with id={product_id} not found")  
#             for i in range(len(products_data)):
#                 product_id = products_data[i]['id']
#                 qty = 1
#                 if 'qty' in products_data[i].keys():
#                     qty = int(products_data[i]['qty'])
#                 shop = Shop.objects.get(id = product_dict[product_id].shop_id)
#                 purchase_item = PurchaseItem.objects.create(
#                     product = product_dict[product_id],
#                     purchase = purchase,
#                     quantity = qty,
#                     price = product_dict[product_id].price,
#                     shop = shop,
#                 ) 
#                 total_price += (qty * purchase_item.price)
#             purchase.total_price = total_price
#             purchase.save()
#             return purchase
#         raise serializers.ValidationError(f"Empty products")  
#         return None