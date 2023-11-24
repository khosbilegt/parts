package mn.random.company.endpoint;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@Path("/api")
public class MainEndpoint {
    @GET
    @Path("/product")
    public Uni<Response> fetchProduct(@QueryParam("productId") String productId) {
        return Uni.createFrom().item(Response.ok().build());
    }

    @POST
    @Path("/product")
    public Uni<Response> createProduct(JsonObject jsonObject) {
        return Uni.createFrom().item(Response.ok().build());
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
    public Uni<Response> fetchUserInfo(@QueryParam("userId") String userId) {
        return Uni.createFrom().item(Response.ok().build());
    }

    private Response handleFailure(Throwable throwable) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(
                new JsonObject()
                        .put("status", "FAILED")
                        .put("message", throwable.getMessage())
        ).build();
    }
}