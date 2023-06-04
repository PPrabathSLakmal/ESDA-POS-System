package lk.esda.pos.api;

import lk.esda.pos.dto.CustomerDTO;
import lk.esda.pos.dto.ResponseErrorDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;

@CrossOrigin
@RestController
@RequestMapping("/customers")
public class CustomerController {
    @Autowired
    private BasicDataSource pool;

    @DeleteMapping
    public void deleteCustomer(@RequestParam("id") String id){
        System.out.println(Integer.parseInt(id));
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("DELETE FROM Customer WHERE id = ?");
            stm.setInt(1,Integer.parseInt(id));
            stm.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping
    public ResponseEntity<?> addCustomer(@RequestBody CustomerDTO customer) throws SQLException {
        System.out.println(customer);
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("INSERT INTO Customer (name, address, contact) VALUES (?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
            stm.setString(1,customer.getName());
            stm.setString(2,customer.getAddress());
            stm.setString(3,customer.getContact());
            stm.executeUpdate();
            ResultSet rst = stm.getGeneratedKeys();
            rst.next();
            customer.setId(rst.getInt(1));
            return new ResponseEntity<>(customer,HttpStatus.CREATED);
        } catch (SQLException e) {
            if ("23000".equals(e.getSQLState())){
                ResponseErrorDTO error = new ResponseErrorDTO(e.getSQLState(), "Contact no is already exist.");
                return new ResponseEntity<>(error, HttpStatus.CONFLICT);
            }else {
                ResponseErrorDTO error = new ResponseErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Something went wrong. Please try again.");
                return new ResponseEntity<>(error, HttpStatus.CONFLICT);
            }
        }
    }
    @GetMapping
    private ResponseEntity<?> getAllCustomers(@RequestParam("q") String txtSearch){
        System.out.println(txtSearch);
        System.out.println("hello");
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("SELECT * FROM Customer WHERE id LIKE ? OR name LIKE ? OR address LIKE ? OR contact LIKE ?");
            String query = "%"+ txtSearch + "%";
            for (int i =1; i <= 4 ; i++) {
                stm.setString(i,query);
            }
            ResultSet rst = stm.executeQuery();
            ArrayList<CustomerDTO> customerList = new ArrayList<>();
            while (rst.next()){
                int id = rst.getInt("id");
                String name = rst.getString("name");
                String address = rst.getString("address");
                String contact = rst.getString("contact");
                CustomerDTO customer = new CustomerDTO(id, name, address, contact);
                customerList.add(customer);
                System.out.println(customer.getName());
            }
            return new ResponseEntity<>(customerList, HttpStatus.OK);
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            ResponseErrorDTO error = new ResponseErrorDTO(e.getMessage(), "Failed load customers please try again.");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
