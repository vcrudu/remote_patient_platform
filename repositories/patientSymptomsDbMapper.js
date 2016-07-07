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
                        choice_id: {S: evidence[i].choice_id}
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
        }
    };
})();