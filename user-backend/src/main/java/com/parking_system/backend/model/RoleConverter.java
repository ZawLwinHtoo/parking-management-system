package com.parking_system.backend.model;

import jakarta.persistence.*;

@Converter
public class RoleConverter implements AttributeConverter<Role,String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        return role == null ? null : role.name().toLowerCase();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Role.valueOf(dbData.toUpperCase());
    }
}
