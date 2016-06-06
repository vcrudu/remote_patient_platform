/**
 * Created by home on 31.07.2015.
 */

(function() {

    function buildDynamoDbString(str){
        if(str) return {S:str};
        else return {NULL:true};
    }

    module.exports = {
        mapNotificationToDbEntity: function (notification) {
            return {
                content: {S: notification.content},
                defaultAction: {S: notification.defaultAction},
                dateTime: {N: notification.dateTime.toString()},
                imageLink: {S: notification.imageLink},
                summary: {S: notification.summary},
                title: {S: notification.title},
                type: {S: notification.type},
                category:{S: notification.category},
                userId: {S: notification.userId},
                read: {BOOL: notification.read},
                responseAction: buildDynamoDbString(notification.responseAction)
            };
        },

        mapNotificationFromDbEntity: function (dbEntity) {
            return {
                content: dbEntity.content.S,
                defaultAction: dbEntity.defaultAction.S,
                dateTime: parseFloat(dbEntity.dateTime.N),
                imageLink: dbEntity.imageLink.S,
                summary: dbEntity.summary.S,
                title: dbEntity.title.S,
                type: dbEntity.type.S,
                category: dbEntity.category.S,
                userId: dbEntity.userId.S,
                read: dbEntity.read ? dbEntity.read.BOOL : false,
                responseAction: dbEntity.responseAction ? dbEntity.responseAction.S : ""
            };
        }
    };
})();
