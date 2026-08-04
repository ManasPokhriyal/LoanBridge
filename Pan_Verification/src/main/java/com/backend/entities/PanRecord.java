package com.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pan_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PanRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pan_id")
    private Long panId;

    @Column(name = "pan_number", length = 10, unique = true, nullable = false)
    private String panNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "credit_score", nullable = false)
    private Integer creditScore;

    private String dob;

    private String status = "VERIFIED";

    // Custom constructor without ID (for saving new records cleanly)
    public PanRecord(String panNumber, String name, Integer creditScore, String dob, String status) {
        this.panNumber = panNumber;
        this.name = name;
        this.creditScore = creditScore;
        this.dob = dob;
        this.status = status;
    }
}
