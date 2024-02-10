/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log','N/search','N/ui/serverWidget','N/record'],
    /**
 * @param{log} log
 */
    (log,search,serverWidget,record) => {
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
                log.debug("currentRecord", currentRecord);
                var recId = scriptContext.newRecord.id;
                log.debug("recId", recId);

                var recType = currentRecord.type;
                log.debug("recType", recType);
                var customerRecId = currentRecord.getValue({
                    fieldId: "entity"
                })
                var fieldLookUp = search.lookupFields({
                    type: "customer",
                    id: customerRecId,
                    columns: 'isinactive'
                });
                var isInActive = fieldLookUp.isinactive
                if (scriptContext.type == 'view') {

                    if (recType == "salesorder") {
                        log.debug("recType123", recType);
                        scriptContext.form.addButton({
                            id: 'custpage_print',
                            label: 'Print',
                            functionName: 'window.open(\'/app/site/hosting/scriptlet.nl?script=113&deploy=1&recordID=' + recId + '&end=true\')'
                        });
                        var hideField = scriptContext.form.addField({
                            id: 'custpage_hide_feld',
                            label: 'Hidden',
                            type: serverWidget.FieldType.INLINEHTML
                        });

                        if (isInActive == true) {
                            var src = "";
                            src += "jQuery('#tdbody_edit').hide();";
                            src += "jQuery('#tdbody_process').hide();";
                            src += "jQuery('#tdbody_billremaining').hide();";
                            src += "jQuery('#tdbody_return').hide();";
                            src += "jQuery('#tdbody_closeremaining').hide();";
                            src += "jQuery('#tdbody_createdeposit').hide();";

                            hideField.defaultValue = "<script>jQuery(function($){require([], function(){" + src + ";})})</script>";
                            scriptContext.form.addButton({
                                id: 'custpage_edit',
                                label: 'Edit',
                                functionName: 'inActive()'
                            });
                            scriptContext.form.addButton({
                                id: 'custpage_bill',
                                label: 'Bill',
                                functionName: 'inActive()'
                            });
                            scriptContext.form.addButton({
                                id: 'custpage_proforma_inv',
                                label: 'Proforma Invoice',
                                functionName: 'inActive()'
                            });
                            scriptContext.form.addButton({
                                id: 'custpage_bill',
                                label: 'Close Order',
                                functionName: 'inActive()'
                            });
                            scriptContext.form.clientScriptModulePath = "./AFAQ_SO_Cus_Cmn_CS.js"
                        }
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
            try {
                var currentRecord = scriptContext.newRecord
                if (scriptContext.type == "create") {
                    var customerId = currentRecord.getValue({
                        fieldId: "entity"
                    })
                    if (customerId) {
                        var fieldLookUp = search.lookupFields({
                            type: "entity",
                            id: customerId,
                            columns: 'rectype'
                        });
                        var entityType = fieldLookUp.rectype
                        if (entityType == "prospect") {
                            currentRecord.setValue({
                                fieldId: "custbody_afaq_so_cst_is_prospect",
                                valiue: true
                            })
                        }
                        else {
                            currentRecord.setValue({
                                fieldId: "custbody_afaq_so_cst_is_prospect",
                                valiue: false
                            })
                        }
                    }


                }
            }
            catch (e) {
                log.debug("error", e.toString())
            }
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
            try {

                var currentRecord = scriptContext.newRecord;
                log.debug("currentRecord", currentRecord);
                var recId = scriptContext.newRecord.id;
                var count = currentRecord.getLineCount("item")
                log.debug("count", count);
                var total = 0;
                for (i = 0; i < count; i++) {
                    var itemtype = currentRecord.getSublistValue({
                        sublistId: "item",
                        fieldId: "itemtype",
                        line: i

                    });
                    var amount = currentRecord.getSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        line: i

                    });
                    log.debug("iiiii", i)
                    log.debug("checking", itemtype)
                    if (i == 1) {
                        currentRecord.setSublistValue({
                            sublistId: "item",
                            fieldId: "orderpriority",
                            value: 1,
                            line: i
                        })
                    }
                    if (itemtype == "Group") {
                        log.debug("inside if conditon")

                        for (var j = i + 1; j < count; j++) {


                            var rate = currentRecord.getSublistValue({
                                sublistId: "item",
                                fieldId: "rate",
                                line: j

                            });
                            log.debug("shdsbd", rate);
                            total = total + rate;
                            log.debug("total", total)
                            if (itemtype == "EndGroup") {

                                break;

                            }
                        }

                    }


                }
                if (scriptContext.type == "create") {
                    var isUpdated = currentRecord.getValue({
                        fieldId: "custbody_afaq_so_cst_is_prospect",
                    })
                    if (isUpdated == true) {
                        var customerId = currentRecord.getValue({
                            fieldId: "entity"
                        })
                        if (customerId) {
                            record.submitFields({
                                type: 'customer',
                                id: customerId,
                                values: {
                                    'isinactive': true
                                }
                            });
                        }
                    }
                }

            }
            catch (e) {
                log.debug("error", e.toString())
            }

        }


        return { beforeLoad, beforeSubmit, afterSubmit }

    });
