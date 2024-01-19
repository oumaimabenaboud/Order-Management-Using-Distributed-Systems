package org.sid.professeur.web;

import org.springframework.web.bind.annotation.*;
import org.sid.professeur.entities.professeur;
import org.sid.professeur.repositories.ProfesseurRepo;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;


@RestController
@RequestMapping("/professeurs")
public class ProfesseurRESTcontroller {
    private final ProfesseurRepo ProfesseurRepo;


    public ProfesseurRESTcontroller (ProfesseurRepo ProfesseurRepo){
        this.ProfesseurRepo=ProfesseurRepo;
    }
    @GetMapping
    public List<professeur> professeur(){
        return ProfesseurRepo.findAll();
    }
    @GetMapping("{id}")
    public professeur professeur(@PathVariable Long id){
        return ProfesseurRepo.findById(id)
                .orElseThrow(()->new RuntimeException(String.format("Account %s not found",id)));
    }

    @PostMapping
    public professeur save(@RequestBody professeur professeur){
        return ProfesseurRepo.save(professeur);
    }
    // Method to generate a unique Long ID
    private static final AtomicLong idCounter = new AtomicLong(1);
    private Long generateUniqueLongId() {
        // Increment the counter and return the new value
        return idCounter.getAndIncrement();
    }

    @PutMapping("{id}")
    public professeur update(@PathVariable Long id,@RequestBody professeur professeur){
        professeur prof = ProfesseurRepo.findById(Long.valueOf(String.valueOf(id))).orElseThrow();
        if(professeur.getNom()!=null) prof.setNom(professeur.getNom());
        if(professeur.getPrenom()!=null) prof.setPrenom(professeur.getPrenom());
        if(professeur.getMail()!=null) prof.setMail(professeur.getMail());
        if(professeur.getMdp()!=null) prof.setMdp(professeur.getMdp());
        if(professeur.isDroit_daccee()) prof.setDroit_daccee(true);

        return ProfesseurRepo.save(prof);
    }
    @DeleteMapping("{id}")
    public void deleteAccount(@PathVariable String id){
        ProfesseurRepo.deleteById(Long.valueOf(id));
    }
}