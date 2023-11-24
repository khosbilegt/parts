package mn.random.company.service;

import io.agroal.api.AgroalDataSource;
import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import mn.random.company.dto.DataTransferObject;
import mn.random.company.dto.Product;
import mn.random.company.dto.User;
import mn.random.company.util.Utilities;
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

    public Uni<List<User>> fetchUsers(String parameter, Utilities.SearchType type) {
        return Uni.createFrom().item(() -> {
            List<User> userList = new ArrayList<>();
            String query = "";
            String queryParameter = parameter;
            switch (type) {
                case PATTERN_SEARCH -> {
                    query = "SELECT * FROM Users WHERE Email LIKE ?";
                    queryParameter = "%" + parameter + "%";
                }
                case EMAIL -> query = "SELECT * FROM Users WHERE Email = ?";
                case ID -> query = "SELECT * FROM Users WHERE UserId = ?";
            }
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, queryParameter);
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

    public Uni<List<Product>> fetchProducts(String parameter, Utilities.SearchType type) {
        return Uni.createFrom().item(() -> {
            List<Product> productList = new ArrayList<>();
            String query = "";
            String queryParameter = parameter;
            switch (type) {
                case PATTERN_SEARCH -> {
                    query = "SELECT * FROM Products WHERE Email LIKE ?";
                    queryParameter = "%" + parameter + "%";
                }
                case EMAIL -> query = "SELECT * FROM Products WHERE Email = ?";
                case ID -> query = "SELECT * FROM Products WHERE ProductId = ?";
            }
            System.out.println(query);
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, queryParameter);
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
                    LOG.errorv(e, "SQL_Exception during Fetch User (Fetch): {0}", e.getMessage());
                    throw new RuntimeException("FETCH_FAILED");
                }
                connection.commit();
            } catch (SQLException e) {
                LOG.errorv(e, "SQL_Exception during Fetch User (Connect): {0}", e.getMessage());
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
}
