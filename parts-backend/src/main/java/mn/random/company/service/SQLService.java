package mn.random.company.service;

import io.agroal.api.AgroalDataSource;
import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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

    public Uni<Void> validateUser(String email, String password) {
        return Uni.createFrom().voidItem().invoke(unused -> {
            boolean success= false;
            try(Connection connection = dataSource.getConnection()) {
                connection.setAutoCommit(false);
                String query = "SELECT * FROM Users WHERE Email = ? AND Password = ?";
                try(PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, email);
                    statement.setString(2, password);
                    try(ResultSet resultSet = statement.executeQuery()) {
                        while(resultSet.next()) {
                            success = true;
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
            if (!success) {
                throw new RuntimeException("EMAIL_OR_PASSWORD_INVALID");
            }
        });
    }
}
