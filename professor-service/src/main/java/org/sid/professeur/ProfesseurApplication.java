package org.sid.professeur;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

@SpringBootApplication
public class ProfesseurApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProfesseurApplication.class, args);
    }
    @Bean
    CommandLineRunner start(org.sid.professeur.repositories.ProfesseurRepo ProfesseurRepo, RepositoryRestConfiguration RepoConfig){
        RepoConfig.exposeIdsFor(org.sid.professeur.entities.professeur.class);
        return args -> {
            ProfesseurRepo.save(new org.sid.professeur.entities.professeur(null, "Bekri", "Ali","a.bikri@edu.umi.ac.ma","4444",true));
            ProfesseurRepo.save(new org.sid.professeur.entities.professeur(null, "Oubelkacem", "Ali","a.oubelkacem@edu.umi.ac.ma","4555",true));
            ProfesseurRepo.save(new org.sid.professeur.entities.professeur(null, "9ezzouz", "Jalal","jalal@edu.umi.ac.ma","0000",false));
            ProfesseurRepo.findAll().forEach(c ->{
                        System.out.println(c.toString());
                    }

            );
        };
    }

}
