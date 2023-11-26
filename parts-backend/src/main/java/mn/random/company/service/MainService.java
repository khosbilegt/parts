package mn.random.company.service;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mn.random.company.dto.*;
import mn.random.company.exception.AuthException;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class MainService {
    @Inject
    SQLService database;
    @Inject
    AuthService auth;

    public Uni<Void> createProduct(JsonObject jsonObject) {
        String token = jsonObject.getString("token");
        return auth.fetchUserByToken(token)
                .onItem().call(user -> {
                    Product product = new Product(jsonObject, user.getId());
                    return database.createProduct(product);
                })
                .replaceWithVoid();
    }

    public Uni<Void> deleteProduct(String token, String productId) {
        return auth.fetchUserByToken(token)
                .onItem().transformToUni(user -> database.fetchProducts(productId, "ID", null)
                        .onItem().call(products -> {
                            if (products.isEmpty()) {
                                throw new NotFoundException();
                            }
                            Product product = products.get(0);
                            if (product.getSellerID().equals(user.getId())) {
                                return database.deleteProduct(productId);
                            }
                            return Uni.createFrom().failure(new AuthException("USER_MISMATCH"));
                        })
                )
                .replaceWithVoid();
    }

    public Uni<List<Product>> fetchProduct(String parameter, String type, Pagination pagination) {
        return database.fetchProducts(parameter, type, pagination);
    }

    public Uni<List<User>> fetchUserInfo(String parameter, String type, Pagination pagination) {
        return database.fetchUsers(parameter, type, pagination);
    }

    public Uni<List<CartItem>> fetchCart(String token) {
        return auth.fetchUserByToken(token)
                .onItem().transformToUni(user -> database.fetchCart(user.getId()))
                .onItem().ifNull().failWith(new NotFoundException("CART_NOT_FOUND"))
                .onItem().ifNotNull().transformToUni(cart -> database.fetchCartItems(cart.getCartId()))
                .onItem().transformToUni(cartItems -> {
                    List<Uni<List<Product>>> productFetchUni = new ArrayList<>();
                    for(CartItem item : cartItems) {
                        productFetchUni.add(database.fetchProducts(item.getProductId(), "ID", null));
                    }
                    if (productFetchUni.isEmpty()) {
                        return Uni.createFrom().item(cartItems);
                    }
                    return Uni.join().all(productFetchUni).andCollectFailures()
                            .onItem().transform(products -> {
                                for(int i = 0; i < products.size(); i++) {
                                    cartItems.get(i).setProduct(products.get(i).get(0));
                                }
                                return cartItems;
                            });
                });
    }

    public Uni<Void> addToCart(String token, String productId) {
        return database.fetchProducts(productId, "ID", null)
                .onItem().transformToUni(products -> {
                    if(products.isEmpty()) {
                        throw new NotFoundException("PRODUCT_NOT_FOUND");
                    }
                    return auth.fetchUserByToken(token);
                })
                .onItem().transformToUni(user -> database.fetchCart(user.getId()))
                .onItem().call(cart -> database.addToCart(cart.getCartId(), productId))
                .replaceWithVoid();
    }

    public Uni<Void> removeFromCart(String token, String cartItemId) {
        return auth.fetchUserByToken(token)
                .onItem().call(user -> database.deleteCartItem(cartItemId))
                .replaceWithVoid();
    }

    public Uni<List<Order>> fetchOrders(String token) {
        return auth.fetchUserByToken(token)
                .onItem().transformToUni(user -> database.fetchOrders(user.getId()))
                .onItem().transformToUni(orders -> {
                    List<Uni<List<OrderItem>>> itemFetchUni = new ArrayList<>();
                    for(Order order : orders) {
                        itemFetchUni.add(database.fetchOrderItems(order.getOrderId()));
                    }
                    if(itemFetchUni.isEmpty()) {
                        return Uni.createFrom().item(orders);
                    }
                    return Uni.join().all(itemFetchUni).andCollectFailures()
                            .onItem().invoke(itemLists -> {
                                for(int i = 0; i < itemLists.size(); i++) {
                                    for(OrderItem item : itemLists.get(i)) {
                                        orders.get(i).addOrderItem(item);
                                    }
                                }
                            })
                            .replaceWith(orders);
                });
    }

    public Uni<Void> createOrder(String token) {
        return auth.fetchUserByToken(token)
                .onItem().transformToUni(user -> database.fetchCart(user.getId()))
                .onItem().call(cart -> database.createOrder(cart))
                .onItem().call(cart -> database.emptyCart(cart.getCartId()))
                .replaceWithVoid();
    }
}