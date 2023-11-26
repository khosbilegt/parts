package mn.random.company.endpoint;

import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import mn.random.company.dto.FileUploadForm;
import mn.random.company.dto.Pagination;
import mn.random.company.service.FileUploadService;
import mn.random.company.service.MainService;
import org.jboss.resteasy.reactive.MultipartForm;

@Path("/api")
public class MainEndpoint {
    @Inject
    MainService service;
    @Inject
    FileUploadService fileUploadService;


    @GET
    @Path("/user")
    public Uni<Response> fetchUser(@QueryParam("userId") String userId) {
        return service.fetchUserInfo(userId, "ID", null)
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
                                    @QueryParam("pageSize") int pageSize,
                                    @QueryParam("pageOffset") int pageOffset) {
        Pagination pagination = new Pagination(pageSize, pageOffset);
        return service.fetchUserInfo(parameter, type, pagination)
                .onItem().ifNotNull().transform(users -> Response.ok().entity(
                        new JsonObject()
                                .put("users", users)
                                .put("size", users.size())
                                .put("pageSize", pagination.getPageSize())
                                .put("pageOffset", pagination.getPageOffset())
                ).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/product")
    public Uni<Response> fetchProduct(@QueryParam("productId") String productId) {
        return service.fetchProduct(productId, "ID", null)
                .onItem().transform(product -> Response.ok().entity(product).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @POST
    @Path("/product")
    public Uni<Response> createProduct(JsonObject jsonObject) {
        return service.createProduct(jsonObject)
                .onItem().transform(this::handleSuccess)
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @DELETE
    @Path("/product")
    public Uni<Response> deleteProduct(@QueryParam("token") String token,
                                       @QueryParam("productId") String productId) {
        return service.deleteProduct(token, productId)
                .onItem().transform(this::handleSuccess)
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/product/browse")
    public Uni<Response> fetchProducts(@QueryParam("pageSize") int pageSize,
                                       @QueryParam("pageOffset") int pageOffset,
                                       @QueryParam("parameter") String parameter,
                                       @QueryParam("type") String type) {
        Pagination pagination = new Pagination(pageSize, pageOffset);
        return service.fetchProduct(parameter, type, pagination)
                .onItem().ifNotNull().transform(users -> Response.ok().entity(
                        new JsonObject()
                                .put("products", users)
                                .put("size", users.size())
                                .put("pageSize", pagination.getPageSize())
                                .put("pageOffset", pagination.getPageOffset())
                ).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/cart")
    public Uni<Response> fetchCart(@QueryParam("token") String token) {
        return service.fetchCart(token)
                .onItem().transform(product -> Response.ok().entity(product).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @PUT
    @Path("/cart")
    public Uni<Response> addToCart(@QueryParam("token") String token,
                                   @QueryParam("productId") String productId) {
        return service.addToCart(token, productId)
                .onItem().transform(this::handleSuccess)
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @DELETE
    @Path("/cart")
    public Uni<Response> removeFromCart(@QueryParam("token") String token,
                                        @QueryParam("cartItemId") String cartItemId) {
        return service.removeFromCart(token, cartItemId)
                .onItem().transform(this::handleSuccess)
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/order")
    public Uni<Response> fetchOrder(@QueryParam("token") String token) {
        return service.fetchOrders(token)
                .onItem().transform(orders -> Response.ok().entity(orders).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @POST
    @Path("/order")
    public Uni<Response> createOrder(@QueryParam("token") String token) {
        return service.createOrder(token)
                .onItem().transform(orders -> Response.ok().entity(orders).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @GET
    @Path("/stats")
    public Uni<Response> fetchStats() {
        return service.fetchStats()
                .onItem().transform(stats -> Response.ok().entity(stats).build())
                .onFailure().recoverWithItem(this::handleFailure);
    }

    @POST
    @Path("/image")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public Uni<Response> uploadFile(FileUploadForm form) {
        return Uni.createFrom().item(() -> {
            String id = fileUploadService.processFile(form.file);
            return Response.ok().entity(new JsonObject()
                    .put("status", "SUCCESS")
                    .put("id", id))
                    .build();
        })
                .onFailure().recoverWithItem(this::handleFailure);
    }

    private Response handleSuccess(Object ignored) {
        return Response.ok().entity(
                        new JsonObject()
                                .put("status", "SUCCESS")
                ).build();
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
}