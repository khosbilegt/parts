package mn.random.company.service;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

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
                .onItem().transform(unused -> {
                    String token = UUID.randomUUID().toString();
                    if (TOKENS.containsKey(email)) {
                        return TOKENS.get(email);
                    }
                    TOKENS.put(email, token);
                    return token;
                });
    }


}
