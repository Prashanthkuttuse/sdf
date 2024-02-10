/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/search', 'N/ui/serverWidget', 'N/record'],
    /**
 * @param{log} log
 */
    (log, search, serverWidget, record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            try {
                var currentRecord = scriptContext.newRecord;
                var recId = scriptContext.newRecord.id;
                var recType = currentRecord.type;
                log.debug("recType", recType);
                var trnId = currentRecord.getValue({
                    fieldId: "createdfrom"
                })
                log.debug("trnId", trnId);
                if (scriptContext.type == "create") {
                    // dbstype = search.lookupFields({
                    //     type: 'transaction',
                    //     id: recid,
                    //     columns: 'type'
                    // });
                    // dbstype = dbstype['type'][0].value;
                    var fieldLookUp = search.lookupFields({
                        type: "transaction",
                        id: trnId,
                        columns: 'type'
                    });
                    var recordType = fieldLookUp['type'][0].value;
                    log.debug("recordType", recordType);
                    if (recordType == "SalesOrd") {
                        var salesOrderRec = record.load({
                            type: "salesorder",
                            id: trnId
                        })
                        var classId = salesOrderRec.getValue({
                            fieldId: "class"
                        })
                        log.debug("classId", classId);
                        currentRecord.setValue({
                            fieldId: "custbody_class_for_item_fulfilllment",
                            value: classId
                        })
                    }
                }
            }
            catch (e) {
                log.debug("error", e.toString())
            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }


        return { beforeLoad }

    });
