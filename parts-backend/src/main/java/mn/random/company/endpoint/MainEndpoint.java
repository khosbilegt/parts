package mn.random.company.endpoint;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import mn.random.company.service.MainService;
import mn.random.company.util.Utilities;
import org.jboss.logging.Logger;

@Path("/api")
public class MainEndpoint {
    @Inject
    MainService service;

    @GET
    @Path("/product")
    public Uni<Response> fetchProduct(@QueryParam("productId") String productId) {
        return service.fetchProduct(productId, "ID")
                .onItem().transform(product -> Response.ok().entity(product).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @POST
    @Path("/product")
    public Uni<Response> createProduct(JsonObject jsonObject) {
        return service.createProduct(jsonObject)
                .onItem().transform(product -> {
                    return Response.ok().build();
                })
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/product/browse")
    public Uni<Response> fetchProducts(@QueryParam("pageSize") String pageSize,
                                       @QueryParam("pageOffset") String pageOffset,
                                       @QueryParam("manufacturer") String manufacturer,
                                       @QueryParam("maxCost") String maxCost,
                                       @QueryParam("minCost") String minCost,
                                       @QueryParam("seller") String sellerEmail) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @GET
    @Path("/order")
    public Uni<Response> fetchOrder(@QueryParam("orderId") String orderId) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @POST
    @Path("/order")
    public Uni<Response> createOrder(@QueryParam("token") String token) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @GET
    @Path("/cart")
    public Uni<Response> fetchCart(@QueryParam("token") String token) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @PUT
    @Path("/cart/add")
    public Uni<Response> addToCart(@QueryParam("token") String token,
                                   @QueryParam("productId") String productId) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @DELETE
    @Path("/cart/remove")
    public Uni<Response> removeFromCart(@QueryParam("token") String token,
                                        @QueryParam("cartItemId") String cartItemId) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @GET
    @Path("/user")
    public Uni<Response> fetchUser(@QueryParam("userId") String userId) {
        return service.fetchUserInfo(userId, "ID")
                .onItem().transform(users -> {
                    if (users.isEmpty()) {
                        throw new NotFoundException();
                    }
                    return Response.ok().entity(users.get(0)).build();
                })
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/user/browse")
    public Uni<Response> fetchUsers(@QueryParam("parameter") String parameter,
                                    @QueryParam("type") String type,
                                    @QueryParam("pageSize") String pageSize,
                                    @QueryParam("pageOffset") String pageOffset) {
        return service.fetchUserInfo(parameter, type)
                .onItem().ifNotNull().transform(users -> Response.ok().entity(
                        new JsonObject()
                                .put("users", users)
                                .put("size", users.size())
                                .put("pageSize", pageSize)
                                .put("pageOffset", pageOffset)
                ).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }


    private Response handleFailure(Throwable throwable) {
        if (throwable instanceof NotFoundException) {
            return Response.status(Response.Status.NOT_FOUND).entity(
                    new JsonObject()
                            .put("status", "NOT_FOUND")
            ).build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(
                    new JsonObject()
                            .put("status", "FAILED")
                            .put("message", throwable.getMessage())
            ).build();
        }
    }

    private Response handleBadRequest() {
        return Response.status(Response.Status.BAD_REQUEST).entity(
                new JsonObject()
                        .put("status", "BAD_REQUEST")
        ).build();
    }
}