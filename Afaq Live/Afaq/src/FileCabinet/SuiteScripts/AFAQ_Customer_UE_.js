/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log'],
    /**
 * @param{log} log
 */
    (log) => {
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

            var currentRecord = scriptContext.newRecord;
            var recId = scriptContext.newRecord.id;
            var recType = currentRecord.type;
            var isInactive = currentRecord.getValue({
                fieldId: "isinactive"
            })
            if (scriptContext.type == 'view' && isInactive == true) {
                scriptContext.form.addButton({
                    id: 'custpage_confirm',
                    label: 'Confirm',
                    functionName: 'active(' + recId + ')'
                });
                scriptContext.form.clientScriptModulePath = "./AFAQ_SO_Cus_Cmn_CS.js"
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
