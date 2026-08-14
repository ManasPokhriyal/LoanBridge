package com.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.PanRecord;

public interface PanRecordRepository extends JpaRepository<PanRecord, Long> {
    Optional<PanRecord> findByPanNumber(String panNumber);
    boolean existsByPanNumber(String panNumber);
}
