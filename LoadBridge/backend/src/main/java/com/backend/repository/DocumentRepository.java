package com.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.Document;
import com.backend.entities.LoanApplication;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByApplication(LoanApplication application);
    List<Document> findByApplicationApplicationId(Long applicationId);
}
