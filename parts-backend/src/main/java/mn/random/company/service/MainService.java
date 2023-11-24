package mn.random.company.service;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mn.random.company.dto.Pagination;
import mn.random.company.dto.Product;
import mn.random.company.dto.User;
import mn.random.company.exception.AuthException;
import mn.random.company.util.Utilities;
import org.jboss.logging.Logger;

import java.util.List;

@ApplicationScoped
public class MainService {
    private static final Logger LOG = Logger.getLogger("PartsBackend");
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
}
