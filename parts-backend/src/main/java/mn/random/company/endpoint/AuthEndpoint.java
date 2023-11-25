package mn.random.company.endpoint;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import mn.random.company.service.AuthService;

@Path("/api/auth")
public class AuthEndpoint {
    @Inject
    AuthService service;

    @GET
    public Uni<Response> validateToken(@QueryParam("token") String token) {
        return service.fetchUserByToken(token)
                .onItem().transform(unused -> Response.ok().entity(
                        new JsonObject()
                                .put("status", "SUCCESS")
                ).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @POST
    @Path("/login")
    public Uni<Response> login(JsonObject jsonObject) {
        return service.login(jsonObject.getString("email"), jsonObject.getString("password"))
                .onItem().transform(token -> Response.ok().entity(
                        new JsonObject()
                                .put("status", "SUCCESS")
                                .put("token", token)
                ).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @POST
    @Path("/register")
    public Uni<Response> register(JsonObject jsonObject) {
        return service.register(jsonObject)
                .onItem().transform(token -> Response.ok().entity(
                        new JsonObject()
                                .put("status", "SUCCESS")
                                .put("token", token)
                ).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    private Response handleFailure(Throwable throwable) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(
                new JsonObject()
                        .put("status", "FAILED")
                        .put("message", throwable.getMessage())
        ).build();
    }
}