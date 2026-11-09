package com.parking_system.backend.config;
import org.springframework.context.annotation.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration @Profile("demo")
public class DemoData {
    @Bean CommandLineRunner sampleData(JdbcTemplate db, PasswordEncoder encoder) {
        return args -> {
            if(db.queryForObject("select count(*) from users where username='admin'",Integer.class)==0)
                db.update("insert into users(username,password,role,full_name,email) values(?,?,?,?,?)", "admin",encoder.encode("DemoAdmin123!"),"admin","Demo Administrator","admin@example.test");
            for(String type : new String[]{"small","medium","large"})
                if(db.queryForObject("select count(*) from parking_rates where slot_type=?",Integer.class,type)==0)
                    db.update("insert into parking_rates(slot_type,rate_per_hour) values(?,?)",type,1000);
            if(db.queryForObject("select count(*) from building",Integer.class)==0) {
                db.update("insert into building(name,number_of_floors,location,address) values('Demo Garage',3,'Yangon','Local demo')");
                Integer id=db.queryForObject("select id from building where name='Demo Garage'",Integer.class);
                for(int i=1;i<=30;i++)
                    db.update("insert into slots(building_id,slot_number,slot_type,is_occupied,is_available,floor,location) values(?,?,?,false,true,?,?)",id,"S"+i,"medium",(i-1)/10+1,"Demo");
            }
        };
    }
}
