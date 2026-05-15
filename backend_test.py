#!/usr/bin/env python3
"""
Backend API Tests for Dentalium Shells E-commerce
Tests all API endpoints with comprehensive scenarios
"""

import requests
import json
import sys
from typing import Dict, Any

# Base URL from environment
BASE_URL = "https://react-dental-shop.preview.emergentagent.com/api"

# Test session ID
TEST_SESSION_ID = "test-sess-1"

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def log_success(message: str):
    print(f"{GREEN}✓ {message}{RESET}")

def log_error(message: str):
    print(f"{RED}✗ {message}{RESET}")

def log_info(message: str):
    print(f"{YELLOW}ℹ {message}{RESET}")

def test_health():
    """Test 1: GET /api/health"""
    print("\n" + "="*60)
    print("TEST 1: GET /api/health")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        data = response.json()
        
        if response.status_code == 200 and data.get('ok') == True:
            log_success(f"Health check passed: {data}")
            return True
        else:
            log_error(f"Health check failed. Status: {response.status_code}, Data: {data}")
            return False
    except Exception as e:
        log_error(f"Health check exception: {str(e)}")
        return False

def test_products_list():
    """Test 2: GET /api/products - should return 6 seeded products"""
    print("\n" + "="*60)
    print("TEST 2: GET /api/products (list all)")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Products list failed. Status: {response.status_code}")
            return False
        
        products = data.get('products', [])
        if len(products) < 6:
            log_error(f"Expected at least 6 products, got {len(products)}")
            return False
        
        # Check categories
        categories = set(p.get('category') for p in products)
        expected_categories = {"Dentalium Shells", "Seashell Jewelry", "Coastal Decor", "Pearl Jewelry", "Heirloom Pieces"}
        
        if not expected_categories.issubset(categories):
            log_error(f"Missing expected categories. Got: {categories}")
            return False
        
        # Check IDs
        ids = [p.get('id') for p in products]
        log_info(f"Product IDs: {ids}")
        
        log_success(f"Products list passed: {len(products)} products, categories: {categories}")
        return True
    except Exception as e:
        log_error(f"Products list exception: {str(e)}")
        return False

def test_products_filter_category():
    """Test 3: GET /api/products?category=Dentalium Shells"""
    print("\n" + "="*60)
    print("TEST 3: GET /api/products?category=Dentalium Shells")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/products?category=Dentalium%20Shells", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Category filter failed. Status: {response.status_code}")
            return False
        
        products = data.get('products', [])
        if len(products) < 1:
            log_error(f"Expected at least 1 product in 'Dentalium Shells' category, got {len(products)}")
            return False
        
        # Verify all products are in the correct category
        for p in products:
            if p.get('category') != 'Dentalium Shells':
                log_error(f"Product {p.get('name')} has wrong category: {p.get('category')}")
                return False
        
        log_success(f"Category filter passed: {len(products)} products in 'Dentalium Shells'")
        return True
    except Exception as e:
        log_error(f"Category filter exception: {str(e)}")
        return False

def test_products_search():
    """Test 4: GET /api/products?q=pearl (case-insensitive)"""
    print("\n" + "="*60)
    print("TEST 4: GET /api/products?q=pearl")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/products?q=pearl", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Search filter failed. Status: {response.status_code}")
            return False
        
        products = data.get('products', [])
        if len(products) < 1:
            log_error(f"Expected at least 1 product matching 'pearl', got {len(products)}")
            return False
        
        # Verify all products contain 'pearl' in name (case-insensitive)
        for p in products:
            if 'pearl' not in p.get('name', '').lower():
                log_error(f"Product {p.get('name')} doesn't match search term 'pearl'")
                return False
        
        log_success(f"Search filter passed: {len(products)} products matching 'pearl'")
        return True
    except Exception as e:
        log_error(f"Search filter exception: {str(e)}")
        return False

def test_product_single():
    """Test 5: GET /api/products/sacred-dentalium-strand"""
    print("\n" + "="*60)
    print("TEST 5: GET /api/products/sacred-dentalium-strand")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/products/sacred-dentalium-strand", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Single product failed. Status: {response.status_code}")
            return False
        
        product = data.get('product')
        if not product:
            log_error("No product returned")
            return False
        
        if product.get('slug') != 'sacred-dentalium-strand':
            log_error(f"Wrong product returned: {product.get('slug')}")
            return False
        
        log_success(f"Single product passed: {product.get('name')}")
        return True
    except Exception as e:
        log_error(f"Single product exception: {str(e)}")
        return False

def test_product_not_found():
    """Test 6: GET /api/products/nonexistent-slug - should return 404"""
    print("\n" + "="*60)
    print("TEST 6: GET /api/products/nonexistent-slug (404)")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/products/nonexistent-slug", timeout=10)
        
        if response.status_code == 404:
            log_success("404 returned correctly for nonexistent product")
            return True
        else:
            log_error(f"Expected 404, got {response.status_code}")
            return False
    except Exception as e:
        log_error(f"Product not found test exception: {str(e)}")
        return False

def test_categories():
    """Test 7: GET /api/categories"""
    print("\n" + "="*60)
    print("TEST 7: GET /api/categories")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Categories failed. Status: {response.status_code}")
            return False
        
        categories = data.get('categories', [])
        if 'All' not in categories:
            log_error("'All' category not found")
            return False
        
        if len(categories) < 2:
            log_error(f"Expected at least 2 categories (including 'All'), got {len(categories)}")
            return False
        
        log_success(f"Categories passed: {categories}")
        return True
    except Exception as e:
        log_error(f"Categories exception: {str(e)}")
        return False

def test_cart_flow():
    """Test 8: Cart CRUD operations"""
    print("\n" + "="*60)
    print("TEST 8: Cart CRUD Flow")
    print("="*60)
    
    try:
        # 8a: Add p-001 with qty 2
        print("\n8a: POST /api/cart - Add p-001 qty 2")
        response = requests.post(
            f"{BASE_URL}/cart",
            json={"sessionId": TEST_SESSION_ID, "productId": "p-001", "qty": 2, "action": "add"},
            timeout=10
        )
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Cart add failed. Status: {response.status_code}, Data: {data}")
            return False
        
        cart = data.get('cart', {})
        items = cart.get('items', [])
        if len(items) != 1 or items[0].get('productId') != 'p-001' or items[0].get('qty') != 2:
            log_error(f"Cart add p-001 failed. Items: {items}")
            return False
        
        log_success("Cart add p-001 qty 2 passed")
        
        # 8b: Add p-002 with qty 1
        print("\n8b: POST /api/cart - Add p-002 qty 1")
        response = requests.post(
            f"{BASE_URL}/cart",
            json={"sessionId": TEST_SESSION_ID, "productId": "p-002", "qty": 1, "action": "add"},
            timeout=10
        )
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Cart add p-002 failed. Status: {response.status_code}")
            return False
        
        cart = data.get('cart', {})
        items = cart.get('items', [])
        if len(items) != 2:
            log_error(f"Expected 2 items in cart, got {len(items)}")
            return False
        
        log_success("Cart add p-002 qty 1 passed")
        
        # 8c: Set p-001 qty to 5
        print("\n8c: POST /api/cart - Set p-001 qty to 5")
        response = requests.post(
            f"{BASE_URL}/cart",
            json={"sessionId": TEST_SESSION_ID, "productId": "p-001", "qty": 5, "action": "set"},
            timeout=10
        )
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Cart set failed. Status: {response.status_code}")
            return False
        
        cart = data.get('cart', {})
        items = cart.get('items', [])
        p001_item = next((i for i in items if i.get('productId') == 'p-001'), None)
        if not p001_item or p001_item.get('qty') != 5:
            log_error(f"Cart set p-001 qty failed. Items: {items}")
            return False
        
        log_success("Cart set p-001 qty to 5 passed")
        
        # 8d: Remove p-002
        print("\n8d: POST /api/cart - Remove p-002")
        response = requests.post(
            f"{BASE_URL}/cart",
            json={"sessionId": TEST_SESSION_ID, "productId": "p-002", "action": "remove"},
            timeout=10
        )
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Cart remove failed. Status: {response.status_code}")
            return False
        
        cart = data.get('cart', {})
        items = cart.get('items', [])
        if len(items) != 1 or items[0].get('productId') != 'p-001':
            log_error(f"Cart remove p-002 failed. Items: {items}")
            return False
        
        log_success("Cart remove p-002 passed")
        
        # 8e: GET cart
        print("\n8e: GET /api/cart/test-sess-1")
        response = requests.get(f"{BASE_URL}/cart/{TEST_SESSION_ID}", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Cart get failed. Status: {response.status_code}")
            return False
        
        cart = data.get('cart', {})
        items = cart.get('items', [])
        if len(items) != 1 or items[0].get('productId') != 'p-001' or items[0].get('qty') != 5:
            log_error(f"Cart get state mismatch. Items: {items}")
            return False
        
        log_success("Cart GET passed - state matches expected")
        
        log_success("✓ All cart flow tests passed")
        return True
        
    except Exception as e:
        log_error(f"Cart flow exception: {str(e)}")
        return False

def test_order_flow():
    """Test 9: Order creation and cart clearing"""
    print("\n" + "="*60)
    print("TEST 9: Order Flow")
    print("="*60)
    
    try:
        # 9a: Create order
        print("\n9a: POST /api/orders")
        order_data = {
            "sessionId": TEST_SESSION_ID,
            "items": [
                {"productId": "p-001", "name": "Sacred Dentalium Strand", "price": 189, "qty": 5}
            ],
            "customer": {
                "name": "Jane Coastal",
                "email": "jane@example.com",
                "address": "123 Ocean Drive",
                "city": "Seaside",
                "zip": "12345",
                "country": "USA"
            },
            "subtotal": 945,
            "shipping": 15,
            "total": 960
        }
        
        response = requests.post(f"{BASE_URL}/orders", json=order_data, timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Order creation failed. Status: {response.status_code}, Data: {data}")
            return False
        
        order = data.get('order', {})
        order_number = order.get('orderNumber', '')
        
        if not order_number.startswith('DS-'):
            log_error(f"Order number doesn't start with 'DS-': {order_number}")
            return False
        
        log_success(f"Order created: {order_number}")
        
        # 9b: Verify cart is cleared
        print("\n9b: GET /api/cart/test-sess-1 (should be empty)")
        response = requests.get(f"{BASE_URL}/cart/{TEST_SESSION_ID}", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Cart get after order failed. Status: {response.status_code}")
            return False
        
        cart = data.get('cart', {})
        items = cart.get('items', [])
        
        if len(items) != 0:
            log_error(f"Cart not cleared after order. Items: {items}")
            return False
        
        log_success("Cart cleared after order")
        
        # 9c: Verify order exists in orders list
        print("\n9c: GET /api/orders (verify order exists)")
        response = requests.get(f"{BASE_URL}/orders", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Orders list failed. Status: {response.status_code}")
            return False
        
        orders = data.get('orders', [])
        order_found = any(o.get('orderNumber') == order_number for o in orders)
        
        if not order_found:
            log_error(f"Order {order_number} not found in orders list")
            return False
        
        log_success(f"Order {order_number} found in orders list")
        
        log_success("✓ All order flow tests passed")
        return True
        
    except Exception as e:
        log_error(f"Order flow exception: {str(e)}")
        return False

def test_admin_products():
    """Test 10: Admin product creation and deletion"""
    print("\n" + "="*60)
    print("TEST 10: Admin Product CRUD")
    print("="*60)
    
    new_product_id = None
    
    try:
        # 10a: Create new product
        print("\n10a: POST /api/products")
        product_data = {
            "name": "Test Coral Bracelet",
            "category": "Seashell Jewelry",
            "price": 125,
            "stock": 10,
            "short": "Beautiful coral bracelet for testing",
            "description": "This is a test product created by automated testing",
            "images": ["https://images.unsplash.com/photo-1571378023115-0df759b786aa?crop=entropy&cs=srgb&fm=jpg&q=85"],
            "details": ["Test detail 1", "Test detail 2"]
        }
        
        response = requests.post(f"{BASE_URL}/products", json=product_data, timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Product creation failed. Status: {response.status_code}, Data: {data}")
            return False
        
        product = data.get('product', {})
        new_product_id = product.get('id')
        new_slug = product.get('slug')
        
        if not new_product_id:
            log_error("No product ID returned")
            return False
        
        log_success(f"Product created: ID={new_product_id}, slug={new_slug}")
        
        # 10b: Verify product in list
        print("\n10b: GET /api/products (verify new product)")
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Products list failed. Status: {response.status_code}")
            return False
        
        products = data.get('products', [])
        product_found = any(p.get('id') == new_product_id for p in products)
        
        if not product_found:
            log_error(f"New product {new_product_id} not found in products list")
            return False
        
        log_success(f"New product found in products list")
        
        # 10c: Delete product
        print(f"\n10c: DELETE /api/products/{new_product_id}")
        response = requests.delete(f"{BASE_URL}/products/{new_product_id}", timeout=10)
        data = response.json()
        
        if response.status_code != 200 or not data.get('ok'):
            log_error(f"Product deletion failed. Status: {response.status_code}, Data: {data}")
            return False
        
        log_success(f"Product deleted: {new_product_id}")
        
        # 10d: Verify product not in list
        print("\n10d: GET /api/products (verify deletion)")
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        
        if response.status_code != 200:
            log_error(f"Products list failed. Status: {response.status_code}")
            return False
        
        products = data.get('products', [])
        product_found = any(p.get('id') == new_product_id for p in products)
        
        if product_found:
            log_error(f"Deleted product {new_product_id} still in products list")
            return False
        
        log_success("Deleted product not in products list")
        
        log_success("✓ All admin product tests passed")
        return True
        
    except Exception as e:
        log_error(f"Admin products exception: {str(e)}")
        return False

def test_newsletter():
    """Test 11: Newsletter subscription"""
    print("\n" + "="*60)
    print("TEST 11: POST /api/newsletter")
    print("="*60)
    try:
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json={"email": "test@example.com"},
            timeout=10
        )
        data = response.json()
        
        if response.status_code == 200 and data.get('ok') == True:
            log_success("Newsletter subscription passed")
            return True
        else:
            log_error(f"Newsletter subscription failed. Status: {response.status_code}, Data: {data}")
            return False
    except Exception as e:
        log_error(f"Newsletter exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("DENTALIUM SHELLS E-COMMERCE BACKEND API TESTS")
    print(f"Base URL: {BASE_URL}")
    print("="*60)
    
    results = {
        "Health Check": test_health(),
        "Products List": test_products_list(),
        "Products Filter by Category": test_products_filter_category(),
        "Products Search": test_products_search(),
        "Single Product": test_product_single(),
        "Product Not Found (404)": test_product_not_found(),
        "Categories": test_categories(),
        "Cart Flow": test_cart_flow(),
        "Order Flow": test_order_flow(),
        "Admin Products": test_admin_products(),
        "Newsletter": test_newsletter(),
    }
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"{test_name}: {status}")
    
    print("\n" + "="*60)
    print(f"Total: {passed}/{total} tests passed")
    print("="*60)
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
