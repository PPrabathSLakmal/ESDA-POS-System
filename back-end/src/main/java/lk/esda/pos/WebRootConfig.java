package lk.esda.pos;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebRootConfig {
    @Bean
    public BasicDataSource basicDataSource(){
        BasicDataSource bds = new BasicDataSource();
        bds.setUsername("root");
        bds.setPassword("122333");
        bds.setDriverClassName("com.mysql.cj.jdbc.Driver");
        bds.setUrl("jdbc:mysql://localhost:3306/esda_pos?createDatabaseIfNotExist=true");
        bds.setMaxTotal(50);
        bds.setInitialSize(20);
        return bds;
    }
}
