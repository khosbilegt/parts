package mn.random.company.service;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mn.random.company.dto.User;
import mn.random.company.exception.AuthException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class AuthService {
    @Inject
    SQLService service;
    private final Map<String, String> TOKENS = new HashMap<>();

    public Uni<String> register(JsonObject jsonObject) {
        return service.registerUser(jsonObject)
                .onItem().transform(unused -> {
                    String email = jsonObject.getString("email");
                    String token = UUID.randomUUID().toString();
                    TOKENS.put(email, token);
                    return token;
                });
    }

    public Uni<String> login(String email, String password) {
        return service.validateUser(email, password)
                .onItem().transform(user -> {
                    if(user != null) {
                        String token = UUID.randomUUID().toString();
                        if (TOKENS.containsKey(email)) {
                            return TOKENS.get(email);
                        }
                        TOKENS.put(email, token);
                        return token;
                    }
                    throw new AuthException("EMAIL_OR_PASSWORD_INVALID");
                });
    }

    public Uni<User> fetchUserByToken(String token) {
        return Uni.createFrom().voidItem().onItem().transformToUni(ignored -> {
                    String email = null;
                    for (Map.Entry<String, String> entry : TOKENS.entrySet()) {
                        if (entry.getValue().equals(token)) {
                            email = entry.getKey();
                        }
                    }
                    if (email == null) {
                        throw new AuthException("TOKEN_INVALID");
                    }
                    return service.fetchUsers(email, "EMAIL", null);
                })
                .onItem().transform(users -> {
                    if (users.isEmpty()) {
                        throw new NotFoundException();
                    }
                    return users.get(0);
                });
    }
}
