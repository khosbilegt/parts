package mn.random.company.service;

import io.agroal.api.AgroalDataSource;
import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import mn.random.company.dto.*;
import org.jboss.logging.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class SQLService {
    private static final Logger LOG = Logger.getLogger("PartsBackend");
    @Inject
    AgroalDataSource dataSource;

    public Uni<Void> registerUser(JsonObject jsonObject) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "INSERT INTO Users (Email, FirstName, LastName, Password, PhoneNumber, Address) "
                        + "VALUES(?,?,?,?,?,?)";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, jsonObject.getString("email"));
                    statement.setString(2, jsonObject.getString("firstName"));
                    statement.setString(3, jsonObject.getString("lastName"));
                    statement.setString(4, jsonObject.getString("password"));
                    statement.setString(5, jsonObject.getString("phoneNumber"));
                    statement.setString(6, jsonObject.getString("address"));
                    statement.executeUpdate();
                } catch(SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Register (Insert): {0}", e.getMessage());
                    throw new RuntimeException("REGISTER_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Register (Connect): {0}", e.getMessage());
                throw new RuntimeException("REGISTER_FAILED");
            }
        });
    }

    public Uni<Boolean> validateUser(String email, String password) {
        return Uni.createFrom().item(() -> {
            boolean validated = false;
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "SELECT * FROM Users WHERE Email = ? AND Password = ?";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, email);
                    statement.setString(2, password);
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            validated = true;
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Validate User (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("LOGIN_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Validate User (Connect): {0}", e.getMessage());
                throw new RuntimeException("LOGIN_FAILED");
            }
            return validated;
        });
    }

    public Uni<List<User>> fetchUsers(String parameter, String type, Pagination pagination) {
        return Uni.createFrom().item(() -> {
            List<User> userList = new ArrayList<>();
            String query = "";
            String queryParameter = parameter;
            if (type != null) {
                switch (type.toUpperCase()) {
                    case "EMAIL_LIKE" -> {
                        query = "SELECT * FROM Users WHERE Email LIKE ?";
                        queryParameter = "%" + parameter + "%";
                    }
                    case "ID" -> query = "SELECT * FROM Users WHERE UserId = ?";
                    default -> query = "SELECT * FROM Users WHERE Email = ?";
                }
            } else {
                query = "SELECT * FROM Users";
            }
            if (pagination != null) {
                query += " LIMIT ? OFFSET ?";
            }
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    if (type != null) {
                        statement.setString(1, queryParameter);
                    }
                    if (pagination != null) {
                        statement.setInt(type == null ? 1 : 2, pagination.getPageSize());
                        statement.setInt(type == null ? 2 : 3, pagination.getRowOffset());
                    }
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            userList.add(new User(
                                    resultSet.getString(1),
                                    resultSet.getString(2),
                                    resultSet.getString(3),
                                    resultSet.getString(4),
                                    resultSet.getString(6),
                                    resultSet.getString(7)
                            ));
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Fetch User (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch User (Connect): {0}", e.getMessage());
                throw new RuntimeException("FETCH_FAILED");
            }
            return userList;
        });
    }

    public Uni<List<Product>> fetchProducts(String parameter, String type, Pagination pagination) {
        return Uni.createFrom().item(() -> {
            List<Product> productList = new ArrayList<>();
            String query = "";
            String queryParameter = parameter;
            if (type != null) {
                switch (type.toUpperCase()) {
                    case "NAME" -> {
                        query = "SELECT * FROM Products WHERE Name LIKE ?";
                        queryParameter = "%" + parameter + "%";
                    }
                    case "SELLER" -> query = "SELECT * FROM Products WHERE Seller = ?";
                    case "MANUFACTURER" -> query = "SELECT * FROM Products WHERE Manufacturer = ?";
                    case "CATEGORY" -> query = "SELECT * FROM Products WHERE Category = ?";
                    case "PRICE" -> query = "SELECT * FROM Products WHERE Price BETWEEN ? AND ?";
                    default -> query = "SELECT * FROM Products WHERE ProductId = ?";
                }
            } else {
                query = "SELECT * FROM Products";
            }
            if (pagination != null) {
                query += " LIMIT ? OFFSET ?";
            }
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    if (type != null) {
                        if (type.equals("PRICE")) {
                            List<String> prices = List.of(parameter.split("|"));
                            statement.setInt(1, Integer.parseInt(prices.get(0)));
                            statement.setInt(2, Integer.parseInt(prices.get(0)));
                            if (pagination != null) {
                                statement.setInt(3, pagination.getPageSize());
                                statement.setInt(4, pagination.getRowOffset());
                            }
                        } else {
                            statement.setString(1, queryParameter);
                            if (pagination != null) {
                                statement.setInt(2, pagination.getPageSize());
                                statement.setInt(3, pagination.getRowOffset());
                            }
                        }
                    } else {
                        if (pagination != null) {
                            statement.setInt(1, pagination.getPageSize());
                            statement.setInt(2, pagination.getRowOffset());
                        }
                    }
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            productList.add(new Product(
                                    resultSet.getString(1),
                                    resultSet.getString(2),
                                    resultSet.getString(3),
                                    resultSet.getString(4),
                                    resultSet.getString(5),
                                    resultSet.getString(6),
                                    resultSet.getInt(7),
                                    resultSet.getInt(8)
                            ));
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Fetch Product (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch Product (Connect): {0}", e.getMessage());
                throw new RuntimeException("FETCH_FAILED");
            }
            return productList;
        });
    }

    public Uni<Void> createProduct(Product product) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "INSERT INTO Products (Seller, ProductName, Description, Category, Manufacturer, Price, Stock) " +
                        "VALUES(?,?,?,?,?,?,?)";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, product.getSellerID());
                    statement.setString(2, product.getProductName());
                    statement.setString(3, product.getDescription());
                    statement.setString(4, product.getCategory());
                    statement.setString(5, product.getManufacturer());
                    statement.setInt(6, product.getPrice());
                    statement.setInt(7, product.getStock());
                    statement.executeUpdate();
                } catch(SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Create Product (Insert): {0}", e.getMessage());
                    throw new RuntimeException("PRODUCT_CREATION_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Product (Connect): {0}", e.getMessage());
                throw new RuntimeException("PRODUCT_CREATION_FAILED");
            }
        });
    }

    public Uni<Void> deleteProduct(String productId) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "DELETE FROM Products WHERE ProductID = ?";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, productId);
                    statement.executeUpdate();
                } catch(SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Delete Product (Delete): {0}", e.getMessage());
                    throw new RuntimeException("PRODUCT_DELETION_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Product (Connect): {0}", e.getMessage());
                throw new RuntimeException("PRODUCT_DELETION_FAILED");
            }
        });
    }

    public Uni<Cart> fetchCart(String userId) {
        return Uni.createFrom().item(() -> {
            List<Cart> cartList = new ArrayList<>();
            String query = "SELECT * FROM Carts WHERE UserID = ?";
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, userId);
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            cartList.add(new Cart(
                                    resultSet.getString(1),
                                    resultSet.getString(2)
                            ));
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Fetch Cart (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch Cart (Connect): {0}", e.getMessage());
                throw new RuntimeException("FETCH_FAILED");
            }
            if (cartList.isEmpty()) {
                return null;
            }
            return cartList.get(0);
        });
    }

    public Uni<Void> createCart(String userId) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "INSERT INTO Carts (UserID) VALUES(?)";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, userId);
                    statement.executeUpdate();
                } catch(SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Create Product (Insert): {0}", e.getMessage());
                    throw new RuntimeException("PRODUCT_CREATION_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Product (Connect): {0}", e.getMessage());
                throw new RuntimeException("PRODUCT_CREATION_FAILED");
            }
        });
    }

    public Uni<Void> addToCart(String userId, String productId) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "INSERT INTO CartItems (CartID, ProductID, Quantity) " +
                        "VALUES (?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE Quantity = Quantity + 1";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, userId);
                    statement.setString(2, productId);
                    statement.setInt(3, 1);
                    statement.executeUpdate();
                } catch(SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Create Product (Insert): {0}", e.getMessage());
                    throw new RuntimeException("PRODUCT_CREATION_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Product (Connect): {0}", e.getMessage());
                throw new RuntimeException("PRODUCT_CREATION_FAILED");
            }
        });
    }

    public Uni<List<CartItem>> fetchCartItems(String cartId) {
        return Uni.createFrom().item(() -> {
            List<CartItem> itemList = new ArrayList<>();
            String query = "SELECT * FROM CartItems WHERE CartID = ?";
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, cartId);
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            itemList.add(new CartItem(
                                    resultSet.getString(1),
                                    resultSet.getString(2),
                                    resultSet.getString(3),
                                    resultSet.getInt(4)
                            ));
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Fetch Cart Items (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch Cart Items (Connect): {0}", e.getMessage());
                throw new RuntimeException("FETCH_FAILED");
            }
            return itemList;
        });
    }


    public Uni<List<Order>> fetchOrders(String userId) {
        return Uni.createFrom().item(() -> {
            List<Order> orderList = new ArrayList<>();
            String query = "SELECT * FROM Orders WHERE SellerID = ? OR UserID = ?";
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, userId);
                    statement.setString(2, userId);
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            orderList.add(new Order(
                                    resultSet.getString(1),
                                    resultSet.getString(2),
                                    resultSet.getString(3),
                                    resultSet.getString(4),
                                    resultSet.getTimestamp(5).toLocalDateTime(),
                                    resultSet.getTimestamp(6).toLocalDateTime()
                            ));
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Fetch Order (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch Order (Connect): {0}", e.getMessage());
                throw new RuntimeException("FETCH_FAILED");
            }
            return orderList;
        });
    }

    public Uni<List<OrderItem>> fetchOrderItems(String orderId) {
        return Uni.createFrom().item(() -> {
            List<OrderItem> itemList = new ArrayList<>();
            String query = "SELECT * FROM OrderItems WHERE OrderID = ?";
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, orderId);
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            itemList.add(new OrderItem(
                                    resultSet.getString(1),
                                    resultSet.getString(2),
                                    resultSet.getString(3),
                                    resultSet.getInt(4)
                            ));
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Fetch Order Items (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch Order Items (Connect): {0}", e.getMessage());
                throw new RuntimeException("FETCH_FAILED");
            }
            return itemList;
        });
    }

    public Uni<Void> createOrder(Cart cart) {
        return Uni.createFrom().voidItem().call(unused -> {
            String createOrderQuery = "INSERT INTO Orders (UserID, State, CreateDate, DeliverDate) " +
                    "VALUES (?, ?, ?, CURRENT_TIMESTAMP, NULL)";
            try(Connection connection = dataSource.getConnection()) {
                try (PreparedStatement preparedStatement = connection.prepareStatement(createOrderQuery, PreparedStatement.RETURN_GENERATED_KEYS)) {
                    preparedStatement.setString(1, cart.getUserId());
                    preparedStatement.setString(2, "RECEIVED");
                    preparedStatement.executeUpdate();
                    try (ResultSet generatedKeys = preparedStatement.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            String orderId = generatedKeys.getString(1);
                            return convertCartItemsToOrderItems(connection, cart.getCartId(), orderId)
                                    .onItem().invoke(ignored -> {
                                        try {
                                            connection.commit();
                                        } catch (SQLException e) {
                                            LOG.errorv(e, "SQL_Exception during Create Order (Commit): {0}", e.getMessage());
                                            throw new RuntimeException("INSERT_FAILED");
                                        }
                                    });
                        } else {
                            throw new SQLException("Creating order failed, no ID obtained.");
                        }
                    }
                } catch (SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Create Order (Insert 1): {0}", e.getMessage());
                    throw new RuntimeException("INSERT_FAILED");
                }
            } catch(SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Order (Connect): {0}", e.getMessage());
                throw new RuntimeException("INSERT_FAILED");
            }
        });
    }

    private Uni<Void> convertCartItemsToOrderItems(Connection connection, String orderID, String cartID) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            String convertItemsQuery = "INSERT INTO OrderItem (OrderID, ProductID, Quantity) " +
                    "SELECT ?, ci.ProductID, ci.Quantity FROM CartItems ci WHERE ci.CartID = ?";
            try (PreparedStatement preparedStatement = connection.prepareStatement(convertItemsQuery)) {
                preparedStatement.setString(1, orderID);
                preparedStatement.setString(2, cartID);
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Order (Insert 2): {0}", e.getMessage());
                throw new RuntimeException("INSERT_FAILED");
            }
        });
    }

    public Uni<Void> deleteOrder(String orderId) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "DELETE FROM Orders WHERE OrderId = ?";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, orderId);
                    statement.executeUpdate();
                } catch(SQLException e) {
                    LOG.errorv(e, "SQL_Exception during Delete Product (Delete): {0}", e.getMessage());
                    throw new RuntimeException("ORDER_DELETION_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Create Product (Connect): {0}", e.getMessage());
                throw new RuntimeException("ORDER_DELETION_FAILED");
            }
        });
    }
}
