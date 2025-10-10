package com.ggamakun.linkle.domain.category.entity;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    private Integer categoryId;
    private Integer parentCategoryId;
    private String name;
    private Integer createdBy;
    private Date createdAt;
    private Integer updatedBy;
    private Date updatedAt;
    private String isDeleted;
}