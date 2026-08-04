package com.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.backend.entities.PanRecord;
import com.backend.repository.PanRecordRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DbSeeder implements CommandLineRunner {

    private final PanRecordRepository panRecordRepository;

    @Override
    public void run(String... args) throws Exception {
        seedPanRecords();
    }

    private void seedPanRecords() {
        if (panRecordRepository.count() > 0) return;

        panRecordRepository.save(new PanRecord("ABCDE1234F", "Aarav Sharma", 780, "1995-05-15", "VERIFIED"));
        panRecordRepository.save(new PanRecord("MANAS1234F", "Manas", 760, "1998-08-20", "VERIFIED"));
        panRecordRepository.save(new PanRecord("XYZDE5678G", "Priya Verma", 735, "1996-11-10", "VERIFIED"));
        panRecordRepository.save(new PanRecord("PQRST9012K", "Rahul Mehta", 680, "1994-03-25", "VERIFIED"));

        System.out.println("[PAN SEEDER] Seeded sample PAN records into pan_records database table.");
    }
}
