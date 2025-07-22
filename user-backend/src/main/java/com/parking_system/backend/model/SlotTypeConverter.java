package com.parking_system.backend.model;

import jakarta.persistence.*;

/**
 * Converts between the DB’s lowercase slot_type values
 * (“small”/“medium”/“large”) and the Java enum names
 * SlotType.SMALL, SlotType.MEDIUM, SlotType.LARGE.
 */
@Converter
public class SlotTypeConverter implements AttributeConverter<SlotType,String> {

    @Override
    public String convertToDatabaseColumn(SlotType attribute) {
        // write lowercase into the DB
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public SlotType convertToEntityAttribute(String dbData) {
        // read DB’s lowercase and map to uppercase enum constant
        return dbData == null ? null : SlotType.valueOf(dbData.toUpperCase());
    }
}
