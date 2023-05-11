from rest_framework import serializers
from .models import Script
from authentication.serializers import UserSerializer


class ScriptSerializer(serializers.ModelSerializer):
    pages_count = serializers.SerializerMethodField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

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
        return obj.script_pages.count()
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