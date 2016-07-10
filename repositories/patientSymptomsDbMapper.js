/**
 * Created by Victor on 7/7/2016.
 */

(function() {
    function mapEvidenceToDbEntity(evidence) {
        var tempEvidence = [];

        if (evidence && evidence.length) {
            for(var i=0;i<evidence.length;i++)
            {
                tempEvidence.push({
                    M: {
                        id: {S: evidence[i].id},
                        name: {S: evidence[i].name},
                        choice_id: {S: evidence[i].choice_id},
                        type: {S: evidence[i].type},
                        text: {S: evidence[i].text}
                    }
                });
            }
        }

        return tempEvidence;
    }

    function mapConditionsToDbEntity(conditions) {
        var tempConditions = [];

        if (conditions && conditions.length) {
            for(var i=0;i<conditions.length;i++)
            {
                tempConditions.push({
                    M: {
                        id: {S: conditions[i].id},
                        name: {S: conditions[i].name},
                        probability: {N: conditions[i].probability}
                    }
                });
            }
        }

        return tempConditions;
    }

    function buildEvidenceArrayFromDbList(evidenceEntity) {
        var evidence = [];

        if (evidenceEntity && evidenceEntity.length > 0) {
            for (var i = 0; i < evidenceEntity.length; i++) {
                evidence.push({
                    id: evidenceEntity[i].M.id.S,
                    name: evidenceEntity[i].M.name.S,
                    choice_id: evidenceEntity[i].M.choice_id.S,
                    type: evidenceEntity[i].M.type.S,
                    text: evidenceEntity[i].M.text.S
                });
            }
        }

        return evidence;
    }

    function buildConditionsArrayFromDbList(conditionsEntity) {
        var conditions = [];

        if (conditionsEntity && conditionsEntity.length > 0) {
            for (var i = 0; i < conditionsEntity.length; i++) {
                conditions.push({
                    id: conditionsEntity[i].M.id.S,
                    name: conditionsEntity[i].M.name.S,
                    probability: conditionsEntity[i].M.probability.N
                });
            }
        }

        return conditions;
    }

    module.exports  = {
        mapToDbEntity : function(item){
            var evidence = mapEvidenceToDbEntity(item.evidence);
            var conditions = mapConditionsToDbEntity(item.conditions)
            return {
                symptomDateTime:{N:item.symptomDateTime},
                patientId:{S:item.patientId},
                slotId: {N:item.slotId},
                evidence: {L: evidence},
                conditions: {L: conditions}
            }
        },

        mapFromDbEntity : function(dbEntity){
            return {
                symptomDateTime: dbEntity.symptomDateTime.N,
                patientId: dbEntity.patientId.S,
                slotId: dbEntity.slotId.N,
                evidence: buildEvidenceArrayFromDbList(dbEntity.evidence.L),
                conditions: buildConditionsArrayFromDbList(dbEntity.conditions.L),
            }
        }
    };
})();