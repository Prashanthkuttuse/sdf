/**		
 * @NApiVersion 2.x		
 * @NScriptType ClientScript		
 * @NModuleScope SameAccount		
 */
define(['N/error', 'N/record', 'N/url', 'N/format', 'N/currentRecord', 'N/search'],
    /**		
     * @param{error} error		
     * @param{file} file		
     * @param{format} format		
     */
    function (error, record, url, format, currentRecordLib, search) {

        /**		
         * Function to be executed after page is initialized.		
         *		
         * @param {Object} scriptContext		
         * @param {Record} scriptContext.currentRecord - Current form record		
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)		
         *		
         * @since 2015.2		
         */
        function pageInit(scriptContext) {
        }

        function active(customerId) {
            record.submitFields({
                type: 'customer',
                id: customerId,
                values: {
                    'isinactive': false
                }
            });
            return true;
        }
        function inActive() {
           alert("Customer is in in-activate state, pleace confirm the customer!")
        }
        return {
            pageInit: pageInit,
            // lineInit: lineInit,	
            active: active,
            inActive: inActive,
        }

    });

