/**
* @NApiVersion 2.0
* @NScriptType Suitelet
* @NModuleScope SameAccount                                                                                                                                                                                                                                   
* Module Description
* Deployment for Invoice Print
* Includes poPrint
*
* Version    Date            Author        Remarks
* 1.0.0      06 Aril 2023     Arshitha     Created for  print                                
* */
define(['N/log', 'N/ui/serverWidget', 'N/record', 'N/format', 'N/config', 'N/search', 'N/https', 'N/url', 'N/redirect', 'N/task', "N/runtime", 'N/render', "N/file", 'N/encode', 'N/render', 'N/config'],
    function (log, serverWidget, record, format, config, search, http, url, redirect, task, runtime, render, file, encode, render, config) {
        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {

            var scriptObj = context.request.parameters;
            var myid = scriptObj.recID;

            var request = context.request;
            var response = context.response;
            //log.debug("myid", myid);

            // loading invoice record 
            var invoiceRec = record.load({
                type: 'invoice',
                id: myid,
                isDynamic: false
            });
            var trandate = invoiceRec.getValue({
                fieldId: 'trandate'
            });
            var date = format.parse({
                value: new Date(trandate),
                type: format.Type.DATE,
            });
            date = format.format({
                value: date,
                type: format.Type.DATE
            });

            if (trandate) {
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                date = trandate.getDate() + "/" + monthNames[trandate.getMonth()] + "/" + trandate.getFullYear();

            }

            var tranid = invoiceRec.getValue({
                fieldId: 'tranid'
            });
            var createdFrom = invoiceRec.getValue({
                fieldId: 'createdfrom'
            });
            var poContract = ""
            if (createdFrom) {
                poContract = search.lookupFields({
                    type: "salesorder",
                    id: createdFrom,
                    columns: ['tranid']
                });
                poContract = poContract['tranid']
            }
            var job = invoiceRec.getText({
                fieldId: 'job'
            });
            var attention = invoiceRec.getValue({
                fieldId: 'tranid'
            });
            var payment_terms = invoiceRec.getValue({
                fieldId: 'terms'
            });
            var currency = invoiceRec.getText({
                fieldId: 'currency'
            });
            var entity = invoiceRec.getValue({
                fieldId: "entity"
            });

            var customerRec = record.load({
                type: "customer",
                id: entity
            });

            // var customerAddSrch =  search.lookupFields({
            //     type: "customer",
            //     id: entity,
            //     columns: ['defaultaddress']
            // });
            // var customerAdd = customerAddSrch['defaultaddress']

            var customerName = customerRec.getText({
                fieldId: "companyname"
            });
            log.debug("customerName",customerName)

            var customerAdd = customerRec.getValue({
                fieldId: "defaultaddress"
            });

            var custTaxNumber = customerRec.getValue({
                fieldId: "vatregnumber"
            });

            var memo = invoiceRec.getValue({
                fieldId: "memo"
            });

            var serviceMonth = invoiceRec.getText({
                fieldId: "postingperiod"
            });



            var billaddress = invoiceRec.getValue({
                fieldId: 'billaddress'
            });
            var subTotal = invoiceRec.getValue({
                fieldId: 'subtotal'
            });
            var taxTotal = invoiceRec.getValue({
                fieldId: 'taxtotal'
            });
            var total = invoiceRec.getValue({
                fieldId: 'total'
            });

            var discountTotal = invoiceRec.getValue({
                fieldId: 'discounttotal'
            });

            var totalAfterDiscount = Number(subTotal) + Number(discountTotal);

            var AmountinWords = invoiceRec.getValue({
                fieldId: 'custbody_total_amount_in_words'
            });

            var sub = invoiceRec.getValue({
                fieldId: 'subsidiary'
            });
            var subName = invoiceRec.getText({
                fieldId: 'subsidiary'
            });
            var subrec = record.load({
                type: 'subsidiary',
                id: sub,
                isDynamic: false
            });

            var sub_add = subrec.getValue({
                fieldId: "mainaddress_text"
            });

            var federalidnumber = subrec.getValue({
                fieldId: 'federalidnumber'
            });

            var logo = subrec.getValue({
                fieldId: 'logo'
            });
            //log.debug("logo", logo);
            if (logo) {
                var fileObj = file.load({ id: logo });

                var imgURLForPDF = "https://4950788.app.netsuite.com/" + fileObj.url;

                //log.debug("imgURLForPDF", imgURLForPDF);
            }
            function relaceCharector(charVal) {
                if (charVal) {
                    return charVal.replace(/&/g, "&amp;");
                } else {
                    return "";
                }
            }
            var logoUrl = relaceCharector(imgURLForPDF);

            var count = invoiceRec.getLineCount({
                sublistId: "item"
            });
            //log.debug("count", count)

            var invoiItemsArr = {};
            var itemsArr = new Array();
            // var totalAmt = 0;
            for (var a = 0; a < count; a++) {

                var falityGrpId = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "custcol_rpm_ad_facility_grp",
                    line: a
                });
                log.debug("falityGrpId", falityGrpId)

                var falityGrpIdIndex = "FG" + falityGrpId;




                // }

                var falityGrpName = invoiceRec.getSublistText({
                    sublistId: "item",
                    fieldId: "custcol_rpm_ad_facility_grp",
                    line: a
                });

                var amt = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "amount",
                    line: a
                });

                var itemId = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "item",
                    line: a
                });

                var itemType = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "itemtype",
                    line: a
                });

                var itemName = invoiceRec.getSublistText({
                    sublistId: "item",
                    fieldId: "item",
                    line: a
                });

                var facility = invoiceRec.getSublistText({
                    sublistId: "item",
                    fieldId: "custcol_rpm_facility",
                    line: a
                });

                var facilityId = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "custcol_rpm_facility",
                    line: a
                });


                var descrptn = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "description",
                    line: a
                });

                var rate = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "rate",
                    line: a
                });

                var qty = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    line: a
                });

                var taxCode = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "taxcode",
                    line: a
                });

                var taxAmt = invoiceRec.getSublistValue({
                    sublistId: "item",
                    fieldId: "taxamt1",
                    line: a
                });

                var falityGrpSrch = search.lookupFields({
                    type: "customrecord_rpm_facility_master",
                    id: facilityId,
                    columns: ['custrecord_exclude_item']
                });
                var printItems = falityGrpSrch['custrecord_exclude_item']

                // if (printItems == false) {
                log.debug("printItems", printItems)

                //If Facility Grp all ready exists in the json
                if (invoiItemsArr.hasOwnProperty(falityGrpIdIndex)) {
                    log.debug("Inside update Grp ID", falityGrpName)
                    //log.debug("fcltyGrpItemsArrVar", fcltyGrpItemsArrVar)
                    if (_IsNullOREmpty(fcltyGrpItemCountVar)) {
                        fcltyGrpItemCountVar = 0;
                    }
                    if (itemType != "OthCharge" && itemType != "Discount") {
                        fcltyGrpItemCountVar = Number(fcltyGrpItemCountVar) + 1;
                    }

                    fcltyGrpItemTotalVar = Number(fcltyGrpItemTotalVar) + Number(amt);

                    invoiItemsArr[falityGrpIdIndex].itemcount = fcltyGrpItemCountVar;
                    invoiItemsArr[falityGrpIdIndex].totalAmt = fcltyGrpItemTotalVar;
                    //for items should be pushed to appropriate facility Grp json 
                    fcltyGrpItemsArrVar.push({
                        "itemid": itemId,
                        "itemtype": itemType,
                        "itemname": itemName,
                        "facility": facility,
                        "description": descrptn,
                        "rate": rate,
                        "qty": qty,
                        "amt": amt,
                        "taxcode": taxCode,
                        "taxamt": taxAmt
                    })
                    invoiItemsArr[falityGrpIdIndex].itemsArr = fcltyGrpItemsArrVar;

                } else {
                    log.debug("Inside New Grp ID", falityGrpName)

                    var fcltyGrpItemCountVar = "fcltyGrpItemCount_" + falityGrpId;
                    var fcltyGrpItemTotalVar = "fcltyGrpItemTotal_" + falityGrpId;
                    var fcltyGrpItemsArrVar = "fcltyGrpItemsArr_" + falityGrpId;

                    //new grp Item assignment to json

                    fcltyGrpItemTotalVar = Number(amt);


                    //log.debug("fcltyGrpItemsArrVar", fcltyGrpItemsArrVar)
                    if (itemType != "OthCharge" && itemType != "Discount") {
                        fcltyGrpItemCountVar = 1;
                    }
                    fcltyGrpItemsArrVar = new Array();
                    //for items should be pushed to appropriate facility Grp json 
                    fcltyGrpItemsArrVar.push({
                        "itemid": itemId,
                        "itemtype": itemType,
                        "itemname": itemName,
                        "facility": facility,
                        "description": descrptn,
                        "rate": rate,
                        "qty": qty,
                        "amt": amt,
                        "taxcode": taxCode,
                        "taxamt": taxAmt
                    })
                    invoiItemsArr[falityGrpIdIndex] = {
                        "printItems": printItems,
                        "itemcount": fcltyGrpItemCountVar,
                        "facilityGrpName": falityGrpName,
                        "totalAmt": fcltyGrpItemTotalVar,
                        "itemsArr": fcltyGrpItemsArrVar
                    }
                }

                //log.debug("invoiItemsArr", invoiItemsArr)

            }

            log.debug("invoiItemsArr", invoiItemsArr)

            var bankId = invoiceRec.getValue({
                fieldId: "custbody_kpi_inv_bank_details"
            });
            var bankName = "";
            var accountNum = "";
            var iban = "";
            var branch = "";
            if (bankId) {
                var bankRec = record.load({
                    type: "customrecord_kpi_bank_details_external",
                    id: bankId
                });
                bankName = bankRec.getValue({
                    fieldId: "custrecord_kpi_bank_details_bank_name"
                });
                accountNum = bankRec.getValue({
                    fieldId: "custrecord_kpi_bank_details_cst_acct_num"
                });
                iban = bankRec.getValue({
                    fieldId: "custrecord_kpi_bank_iban"
                });
                branch = bankRec.getValue({
                    fieldId: "custrecord_kpi_bank_details_bank_branch"
                });
            }

            log.debug("bankName", bankName)
            log.debug("accountNum", accountNum)
            log.debug("iban", iban)
            log.debug("branch", branch)


            var xml = '<?xml version="1.0"?>';
            xml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
            xml += '<pdf>';
            xml += '<head>';
            xml += '<link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />';
            xml += '    <style type="text/css">span, table {';
            xml += '     font-family: stsong, sans-serif;';
            xml += '    font-family: msung, sans-serif;';
            xml += '    font-family: heiseimin, sans-serif;';
            xml += '     font-family: hygothic, sans-serif;';
            xml += '    font-family: verdana;';
            xml += '    font-family: sans-serif;';
            xml += '     font-size: 9pt;';
            xml += '     table-layout: fixed;';
            xml += '     }';
            xml += '     td.headerB {';
            xml += '       font-size: 9px;';
            xml += '     }';
            xml += '     td.headerM {';
            xml += '       font-size: 9px;';
            xml += '     }';
            xml += '     span.headerM {';
            xml += '       font-size: 9px;';
            xml += '     }';
            xml += '     td.headerR {';
            xml += '       font-size: 10px;';
            xml += '     }';
            xml += '     td.headerRB {';
            xml += '       font-size: 12px;';
            xml += '       font-weight: bold;';
            xml += '     }';
            xml += '     th {';
            xml += '     font-weight: bold;';
            xml += '     font-size: 8.5pt;';
            xml += '     padding-top: 2px;';
            xml += '     vertical-align: middle;';
            xml += '         }';
            xml += '     b {';
            xml += '     font-weight: bold;';
            xml += '     color: #333333;';
            xml += '     }';
            xml += '     table.header td {';
            xml += '     padding: 0;';
            xml += '     font-size: 10pt;';
            xml += '     }';
            xml += '     table.footer td {';
            xml += '     padding: 0;';
            xml += '     font-size: 8pt;';
            xml += '     }';
            xml += '     #itemtable th p{';
            xml += '     vertical-align: text-top !important;';
            xml += '     text-align: center !important;';
            xml += '     }';
            xml += '     #itemtable{';
            xml += '     font-size: 8.5pt !important;';
            xml += '     border: 0.5px solid #000000';
            xml += '     }';
            xml += '     table.total {';
            xml += '     page-break-inside: avoid;';
            xml += '     }';
            xml += '     tr.totalrow {';
            xml += '     background-color: #e3e3e3;';
            xml += '     line-height: 200%;';
            xml += '     }';
            xml += '     td.totalboxtop {';
            xml += '     font-size: 12pt;';
            xml += '     background-color: #e3e3e3;';
            xml += '     }';
            xml += '     span.title {';
            xml += '     font-size: 28pt;';
            xml += '     }';
            xml += '     .smallTitle {';
            xml += '     font-size: 9pt;';
            xml += '     }';

            xml += '    .colorId ';
            xml += ' {      background-color: #e3e3e3; ';

            xml += '     } ';

            xml += '     span.number {';
            xml += '     font-size: 16pt;';
            xml += '     text-align:center;';
            xml += '     }';
            xml += '     span.itemname {';
            xml += '     font-weight: bold;';
            xml += '     line-height: 150%;';
            xml += '     }';
            xml += '     hr {';
            xml += '     width: 100%;';
            xml += '     border:  #1a1a00;';
            xml += '     background-color: 0.5px solid black;';
            xml += '     height: 10px;';
            xml += '     }';
            xml += '     table.smalltext tr td {';
            xml += '     font-size: 8pt;';
            xml += '     }';
            xml += '       p.alignR {';
            xml += '     text-align: right !important;';
            xml += '     }';
            xml += '     p.alignL {';
            xml += '     text-align: left !important;';
            xml += '     }';
            xml += '     p.alignC {';
            xml += '     text-align: center !important;';
            xml += '     }';
            xml += '     .td_right_line{';
            xml += '     border-right :1px solid #000000;';
            xml += '     }';
            xml += '     .td_bottom_line{';
            xml += '     border-bottom: 1px solid #000000;';
            xml += '     }';
            xml += '     .td_top_line{';
            xml += '     border-top :1px solid #000000;';
            xml += '     }';
            xml += '		.title ';
            xml += '{		font-weight: bold; ';
            xml += '		align:center!important; ';
            xml += '		font-size:17pt; ';
            + '    font-family: Calibri-font;'
            xml += '		} ';
            xml += '     .footer-img{';
            xml += '        top: 0px;';
            xml += '     right: 0px;';
            xml += '     left: 0px;';
            xml += '     bottom: 0px;';
            xml += '     }';
            xml += '     .footer{';
            xml += '     margin-left:-45px; margin-right:-60px; margin-bottom:-115px;';
            xml += '     }';
            xml += '     .td_left_line{';
            xml += '     border-left :1px solid #000000;';
            xml += '     }';
            xml += '     .maintbl{';
            xml += '     border:0.5px solid #000000;';
            xml += '     }';
            xml += '     .footertbl{';
            xml += '     border:0.5px solid #000000;';
            xml += '     border-top: 0px !important;';
            xml += '     }';
            xml += '     .footertbl2{';
            xml += '         border-left: 0.5px solid #000000;';
            xml += '     border-right: 0.5px solid #000000;';
            xml += '     border-top: 0px !important;';
            xml += '     }';
            xml += '     .pad_left{';
            xml += '     padding-left: 5px!important;';
            xml += '     }';
            xml += '     th,td{';
            xml += '     padding:4px;';
            xml += '     }';
            xml += ' .custstamp{';
            xml += ' color:#d3d3d3;';
            xml += '     font-weight: bold;';
            xml += '         }';
            xml += '     </style>';
            xml += '        <macrolist>';
            xml += '        <macro id="nlheader">';


            xml += '<table style="width=100%">';

            xml += '<tr> ';
            xml += '<td width="50%" > ';
            xml += '<table width="100%"> ';
            xml += '<tr> ';
            xml += '<td font-size="18pt"><b>TAX INVOICE</b> ';

            xml += '</td> ';
            xml += '</tr> ';
            xml += '</table> ';
            xml += '</td> ';
            xml += '<td width="50%"  margin-left="250px"> ';

            xml += '<table style="width:100%">';
            if (logo) {
                xml += '<tr> ';
                xml += '<td align="right" > ';
                xml += '<img src="' + logoUrl + '" style="width:200px;height:250px;position:absolute;padding-top:-40px;top:-70px;left:20px;"/> ';
                xml += '</td> ';
                xml += '</tr> ';
            }
            xml += '</table> ';
            xml += '</td> ';
            xml += '</tr> ';
            xml += '</table> ';
            xml += '         </macro>';

            xml += '                            <macro id="nlfooter"> ';
            xml += '                                <table  style="width:100%;"> ';
            xml += '                                    <tr> ';
            xml += '                                        <td align="left" style="width:70%;"> ';
            // xml += '<img src= "http://8333928.shop.netsuite.com/core/media/media.nl?id=14&amp;c=8333928&amp;h=1UzcdbKSXTD3nPIoHXJRISTAwB5zwjNfecnlPDWqHhh8hZvT" style="width:100%;height:150px;padding-left:-70px;"/>'
            xml += '                                        </td> ';
            xml += '                                     </tr> ';
            xml += '                                 </table> ';
            xml += '                                 <table style="width: 100%;"> ';
            xml += '                                     <tr> ';
            xml += '                                        <td align="right"><pagenumber/> of <totalpages/></td>';

            xml += '                                </tr> ';
            xml += '                            </table> ';
            xml += '                        </macro> ';

            xml += '     </macrolist>';
            xml += '</head>';

            xml += '  <body header="nlheader" background-macro="watermark" header-height="8%" footer="nlfooter" footer-height="8%" padding="0.25in 0.25in 0.25in 0.25in" size="A4">';

            xml += '  <table width="100%" padding-top="10px">';
            xml += '            <tr>';
            xml += '              <td width="50%" >';
            xml += '                <table width="100%" border="0.5px">';
            xml += '                 ';
            xml += '                  <tr>';
            xml += '                    <td colspan="4"  ><b>' + subName + '</b></td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td colspan="4" ><p align="left">' + relaceSlashN(sub_add) + '</p></td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td colspan="3"  border-top="0.5px"><b>TAX Registration No. (TRN) : </b></td>';
            xml += '                    <td  border-top="0.5px" margin-left="-35px" ><p align="left">' + federalidnumber + '</p></td>';
            xml += '                  </tr>';
            xml += '                </table>';
            xml += '              </td>';
            xml += '              <td width="20%" >';
            xml += '                <table width="100%">';
            xml += '                  <tr>';
            xml += '                    <th></th>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td></td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td></td>';
            xml += '                  </tr>';
            xml += '                </table>';
            xml += '              </td>';
            xml += '              <td width="40%" margin-right="-5px" margin-left="-5px" >';
            xml += '                <table width="100%" border="1">';
            xml += '                  ';
            xml += '                  <tr >';
            xml += '                    <td colspan="2" style="border-bottom:0.5px;border-right:0.5px" ><b>Date of Invoice</b></td>';
            xml += '                    <td colspan="2" style="border-bottom:0.5px" >' + date + '</td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td colspan="2" style="border-right:0.5px"><b>Invoice No.</b></td>';
            xml += '                     <td  colspan="2" >' + tranid + '</td>';
            xml += '                  </tr>';
            xml += '                </table>';
            xml += '              </td>';
            xml += '            </tr>';
            xml += '          </table>';
            xml += '          <hr/>';
            xml += '          <br/>';
            xml += '          <table width="100%">';
            xml += '            <tr>';
            xml += '              <td width="40%">';
            xml += '                <table width="100%" height="60%" style="padding-top:-40px;">';
            // xml += '                 ';
            xml += '                  <tr>';
            xml += '                    <td colspan="4"  border-top="0.5px"  border-right="0.5px" border-left="0.5px"><b>BILL TO&nbsp;:</b></td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td colspan="4"  border-top="0.5px"  border-right="0.5px" border-left="0.5px"><b>' + customerName + '</b><br/>' + relaceSlashN(customerAdd) + '</td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td colspan="2" border-top="0.5px"  border-left="0.5px" border-bottom="0.5px"><b>TAX Registration No. : </b></td>';
            xml += '                    <td  colspan="2"  border-top="0.5px" border-bottom="0.5px" border-right="0.5px" ><b>' + custTaxNumber + '</b></td>';
            xml += '                  </tr>';
            xml += '                </table>';
            xml += '              </td>';
            xml += '              <td width="20%" >';
            xml += '                <table width="100%">';
            xml += '                  <tr>';
            xml += '                    <th></th>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td></td>';
            xml += '                  </tr>';
            xml += '                  <tr>';
            xml += '                    <td></td>';
            xml += '                  </tr>';
            xml += '                </table>';
            xml += '              </td>';
            xml += '              <td width="40%" margin-right="-5px" margin-left="-5px">';
            xml += '               <table width="100%" border ="1"  >';
            if (serviceMonth) {
                xml += '                  <tr>';
                xml += '                    <td colspan="2" border-right="0.1px" border-bottom="0.1px">Service Month</td>';
                xml += '                    <td colspan="2"  border-bottom="0.1px" ><p align="left">' + serviceMonth + '</p></td>';
                xml += '                  </tr>';
            }
            if (tranid) {

                xml += '                  <tr>';
                xml += '                    <td colspan="2" border-right="0.1px" >PO Contract</td>';
                xml += '                     <td  colspan="2"   ><p align="left"><b>' + poContract + '</b></p></td>';
                xml += '                  </tr>';
            }

            if (payment_terms) {
                xml += '                   <tr>';
                xml += '                    <td colspan="2" border-right="0.1px" ><b>Payment Terms</b></td>';
                xml += '                     <td  colspan="2" >' + payment_terms + '</td>';
                xml += '                  </tr>';
            }
            xml += '    </table>';
            // if (job) {
            //     xml += '            <table  margin-top="20px" border="1"  width="100%"><tr>  ';
            //     xml += '             <td  width="100%" align="center">' + job + '</td>';
            //     xml += '            </tr>';
            //     xml += '            </table>';

            // }
            xml += '          </td>';
            xml += '        </tr>';
            xml += '      </table>';


            var count;
            // if (count > 0) {
            xml += '  <table class="itemtable" style="width: 100%; margin-top: 10px;border:0.5px solid black">';

            xml += '            <thead>';
            xml += '            <tr>';
            xml += '            <th align="center" style="border-right:1px"  width="8%"><p align="center">SL No.</p></th>';
            xml += '             <th align="center"   style="border-right:1px"  width="52%">DESCRIPTIONS</th>';
            xml += '            <th align="center"  style="border-right:1px" width="6%">&nbsp;&nbsp;QTY</th>';
            //xml += '            <th align="center" style="border-right:1px" colspan="1"><p align="left">Days/Hours</p></th>';
            xml += '            <th align="center" style="border-right:1px" width="17%" ><p align="center">UNIT PRICE(IN AED)</p></th>';
            xml += '            <th align="center" width="17%">TOTAL(IN AED)</th>';
            xml += '            </tr>';
            xml += '        </thead>';

            // for (var i = 0; i < count; i++) {

            //     var description = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'description',
            //         line: i
            //     });
            //     var patient_name = invoiceRec.getSublistText({
            //         sublistId: 'item',
            //         fieldId: 'custcol_rpm_inv_patient_id',
            //         line: i
            //     });
            //     var gpsinvoiceID = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'custcol_rpm_gps_inv_creation_details',
            //         line: i
            //     });
            //     log.debug("gpsinvoiceID", gpsinvoiceID);
            //     if (gpsinvoiceID) {
            //         var gpsRec = record.load({
            //             type: 'customrecord_gps_invoice_details',
            //             id: gpsinvoiceID
            //         });

            //         var patientType = gpsRec.getText({
            //             fieldId: 'custrecord_gps_inv_detail_patient_type',
            //         });

            //         var referal_fee = gpsRec.getValue({
            //             fieldId: 'custrecord_gps_inv_detail_rpm',
            //         });
            //         var billingAmount = gpsRec.getValue({
            //             fieldId: 'custrecord_gps_inv_detail_patient_bill',
            //         });
            //     }
            //     var quantity = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'quantity',
            //         line: i
            //     });

            //     var units = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'units_display',
            //         line: i
            //     });


            //     var rate = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'rate',
            //         line: i
            //     });

            //     var taxrate = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'taxrate1',
            //         line: i
            //     });
            //     var taxamt = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'tax1amt',
            //         line: i
            //     });
            //     var amount = invoiceRec.getSublistValue({
            //         sublistId: 'item',
            //         fieldId: 'amount',
            //         line: i
            //     });

            var facilityGrpCount = 1;
            var serialno = "";

            if (memo) {
                xml += '         <tr>';
                xml += '                <td align="center" style="border-top:1px;border-right:1px" ></td>';
                xml += '                <td align="left"   style="border-top:1px;border-right:1px" ><p align="left"><b>' + memo + '</b></p></td>';
                xml += '                <td align="center"   style="border-top:1px;border-right:1px" ></td>';
                xml += '                <td align="center"   style="border-top:1px;border-right:1px" ></td>';
                xml += '                <td align="right"  style="border-top:1px" ></td>';
                xml += '            </tr>';
            }

            for (var key in invoiItemsArr) {

                var itemCount = 1;
                var facilityGrpId = key;
                var itemcount = invoiItemsArr[key].itemcount;
                var items = invoiItemsArr[key].itemsArr;
                //log.debug("items", items);
                var printItems = invoiItemsArr[key].printItems
                //log.debug("printItems", printItems);

                if (printItems == false) {
                    //harcoded line for Charge


                    var totalAmt = invoiItemsArr[key].totalAmt;

                    var unitPrice = Number(totalAmt) / Number(itemcount)

                    xml += '         <tr>';
                    xml += '                <td align="center" style="border-top:1px;border-right:1px" ></td>';
                    xml += '                <td align="left"   style="border-top:1px;border-right:1px" ><p align="left"><b>Clinics/Center-on-shore</b></p></td>';
                    xml += '                <td align="center"   style="border-top:1px;border-right:1px" ></td>';
                    xml += '                <td align="center"   style="border-top:1px;border-right:1px" ></td>';
                    xml += '                <td align="right"  style="border-top:1px" ></td>';
                    xml += '            </tr>';

                    xml += '         <tr>';
                    xml += '                <td align="center" style="border-top:1px;border-right:1px" >' + facilityGrpCount + '</td>';
                    xml += '                <td align="left"   style="border-top:1px;border-right:1px" ><p align="left"><b>Clinic charges</b></p></td>';
                    xml += '                <td align="center"   style="border-top:1px;border-right:1px" ><b>' + itemcount + '</b></td>';
                    xml += '                <td align="right"    style="border-top:1px;border-right:1px" >' + numberWithCommas(unitPrice.toFixed(2)) + '</td>';
                    xml += '                <td align="right"   style="border-top:1px" ><b>' + numberWithCommas(totalAmt.toFixed(2)) + '</b></td>';
                    xml += '            </tr>';

                    for (var itmKey in items) {

                        serialno = facilityGrpCount + "." + itemCount;

                        var itemid = items[itmKey].itemid;
                        var itemtype = items[itmKey].itemtype;
                        var itemname = items[itmKey].itemname;
                        var descrptn = items[itmKey].description;
                        var qty = items[itmKey].qty;
                        var amt = items[itmKey].amt;

                        var itemUnitPrice = 0;
                        var amtFormatted = amt;
                        if (qty) {
                            itemUnitPrice = Number(amt) / Number(qty);
                        }


                        if (amt < 0) {
                            amtFormatted = "(" + amt + ")"
                        }


                        //log.debug("itemtype", itemtype);
                        //log.debug("descrptn", descrptn);


                        //print tr line for items
                        if (itemtype != "OthCharge" && itemtype != "Discount") {
                            //dont increment serial no
                            //log.debug("inside if", itemtype);

                            xml += '         <tr>';
                            xml += '                <td align="center" style="border-top:1px;border-right:1px" >' + serialno + '</td>';
                            xml += '                <td align="left"   style="border-top:1px;border-right:1px" ><p align="left">' + itemname + '</p></td>';
                            xml += '                <td align="center"   style="border-top:1px;border-right:1px" ></td>';
                            xml += '                <td align="center"    style="border-top:1px;border-right:1px" ></td>';
                            xml += '                <td align="right"  style="border-top:1px" ></td>';
                            xml += '            </tr>';

                            itemCount++;

                        } else {
                            //log.debug("inside else", itemtype);

                            // xml += '         <tr>';
                            // xml += '                <td align="center" style="border-top:1px;border-right:1px" >' + serialno + '</td>';
                            // xml += '                <td align="left"  colspan="3" style="border-top:1px;border-right:1px" ><p align="left">' + itemname + '</p></td>';
                            // xml += '                <td align="center"  colspan="1" style="border-top:1px;border-right:1px" ></td>';
                            // xml += '                <td align="center"  colspan="2"  style="border-top:1px;border-right:1px" ></td>';
                            // xml += '                <td align="right"  colspan="2" style="border-top:1px" ></td>';
                            // xml += '            </tr>';

                            xml += '         <tr>';
                            xml += '                <td align="center" style="border-top:1px;border-right:1px" ></td>';
                            xml += '                <td align="left"   style="border-top:1px;border-right:1px" ><p align="left">' + descrptn + '</p></td>';
                            xml += '                <td align="center"   style="border-top:1px;border-right:1px" ><b>' + qty + '</b></td>';
                            xml += '                <td align="right"    style="border-top:1px;border-right:1px" >' + itemUnitPrice + '</td>';
                            xml += '                <td align="right"   style="border-top:1px" ><b>' + amtFormatted + '</b></td>';
                            xml += '            </tr>';
                        }

                    }
                }

                //print facility grp name raw
                if (printItems == true) {
                    // print qty & amt at the same line

                    var totalAmt = invoiItemsArr[key].totalAmt;

                    var unitPrice = Number(totalAmt) / Number(itemCount)


                    xml += '         <tr>';
                    xml += '                <td align="center" style="border-top:1px;border-right:1px" ></td>';
                    xml += '                <td align="left"  style="border-top:1px;border-right:1px" ><p align="left"><b>Clinics/Center-on-shore</b></p></td>';
                    xml += '                <td align="center"  style="border-top:1px;border-right:1px" ></td>';
                    xml += '                <td align="center"   style="border-top:1px;border-right:1px" ></td>';
                    xml += '                <td align="right"  style="border-top:1px" ></td>';
                    xml += '            </tr>';

                    xml += '         <tr>';
                    xml += '                <td align="center" style="border-top:1px;border-right:1px" >' + facilityGrpCount + '</td>';
                    xml += '                <td align="left"  style="border-top:1px;border-right:1px" ><p align="left"><b>Clinic charges</b></p></td>';
                    xml += '                <td align="center"  style="border-top:1px;border-right:1px" ><b>' + itemcount + '</b></td>';
                    xml += '                <td align="center"    style="border-top:1px;border-right:1px" >' + numberWithCommas(unitPrice.toFixed(2)) + '</td>';
                    xml += '                <td align="right"   style="border-top:1px" ><b>' + numberWithCommas(totalAmt.toFixed(2)) + '</b></td>';
                    xml += '            </tr>';
                }

                facilityGrpCount++;
            }


            // var srNo = i + 1;
            // xml += '         <tr>';
            // xml += '                <td align="center" style="border-top:1px;border-right:1px" >' + srNo + '</td>';
            // xml += '                <td align="left"  colspan="3" style="border-top:1px;border-right:1px" ><p align="left">' + description + '&nbsp;&nbsp;-&nbsp;&nbsp;' + patient_name + '</p></td>';
            // xml += '                <td align="center"  colspan="1" style="border-top:1px;border-right:1px" >' + quantity + '</td>';
            // //xml += '                <td align="center"   colspan="1" style="border-top:1px;border-right:1px" ></td>';
            // xml += '                <td align="center"  colspan="2"  style="border-top:1px;border-right:1px" >' + numberWithCommas(rate.toFixed(2)) + '</td>';
            // xml += '                <td align="right"  colspan="2" style="border-top:1px" >' + numberWithCommas(amount.toFixed(2)) + '</td>';
            // xml += '            </tr>';
            // //}
            xml += '    <tr>';

            xml += '        <td align="right" colspan="4" style="border-top:1px;border-right:1px"><b>SUBTOTAL</b></td>';
            xml += '        <td align="right" colspan="1" style="border-top:1px;"><b>' + numberWithCommas(subTotal.toFixed(2)) + '</b></td>';
            xml += '        </tr>';

            xml += '        <tr>';
            xml += '        <td align="right" colspan="4" style="border-top:1px;border-right:1px"><b>DISCOUNT AMOUNT</b></td>';
            xml += '        <td align="right" colspan="1" ><b>' + numberWithCommas(discountTotal.toFixed(2)) + '</b></td>';
            xml += '        </tr>';
            xml += '        <tr>';

            xml += '        <td align="right" colspan="4" style="border-top:1px;border-right:1px"><b>TOTAL AFTER DISCOUNT(A)</b></td>';
            xml += '        <td align="right" colspan="1" style="border-top:1px;"><b>' + numberWithCommas(totalAfterDiscount.toFixed(2)) + '</b></td>';
            xml += '        </tr>';


            xml += '        <tr>';

            xml += '        <td align="right" colspan="4" style="border-top:1px;border-right:1px"><b>VAT (B)</b></td>';
            xml += '        <td align="right" colspan="1" style="border-top:1px;"><b>' + numberWithCommas(taxTotal.toFixed(2)) + '</b></td>';
            xml += '        </tr>';
            xml += '        <tr>';

            xml += '        <td align="right" colspan="4" style="border-top:1px;border-right:1px"><b>NET TOTAL (A+B)</b></td>';
            xml += '        <td align="right" colspan="1" style="border-top:1px;"><b>' + currency + ' ' + numberWithCommas(total.toFixed(2)) + '</b></td>';
            xml += '        </tr>';
            if (AmountinWords) {

                xml += '        <tr >';
                xml += '                    <td align="left" colspan="10" style="border-top:1px"><b>Amount In Words&nbsp;:&nbsp;' + currency + ' ' + AmountinWords + '</b></td>';
                xml += '                    </tr>';
            }
            xml += '                    </table>';

            xml += '                    <br/>';

            xml += ' <table  width="100%" >';
            xml += '    <tr>';
            xml += '    <td>';

            xml += ' <table style="border:0.5px solid black" width="100%" >';
            xml += '    <tr>';
            xml += '    <td colspan="10">';
            xml += '   <b> Bank Details:</b>';
            xml += '    </td>';
            xml += '    </tr>';
            xml += ' </table>';
            xml += ' <table style="border:0.5px solid black" width="100%" >';
            xml += '    <tr>';
            xml += '    <td style="margin-left:40px" width="29%"><b>Bank Account Name</b></td>';
            xml += '    <td  width="1%"><b>:</b></td>';
            xml += '    <td align="left" width="70%">' + bankName + '</td>';
            xml += '    </tr>';
            xml += '    <tr>';
            xml += '    <td style="margin-left:40px"  width="29%"> <b>Account Number with IBAN</b></td>';
            xml += '    <td  width="1%"><b>:</b></td>';
            xml += '    <td width="70%"> ' + iban + '</td>';
            xml += '    </tr>';
            xml += '    <tr>';
            xml += '    <td style="margin-left:40px" width="29%"><b>Bank Name</b></td>';
            xml += '    <td  width="1%"><b>:</b></td>';
            xml += '    <td width="70%">' + bankName + '</td>';
            xml += '    </tr>';
            xml += '    <tr>';
            xml += '    <td style="margin-left:40px" width="29%"><b>Bank Branch</b></td>';
            xml += '    <td  width="1%"><b>:</b></td>';
            xml += '    <td width="70%">' + branch + '</td>';
            xml += '    </tr>';
            xml += '    </table>';
            xml += ' <table style="border:0.5px solid black" width="100%" >';
            xml += '    <tr>';
            xml += '    <td  colspan="10"><b>Note &nbsp;:</b></td>';
            xml += '    </tr>';
            xml += '    <tr>';
            xml += '    <td>1.</td>';
            xml += '     <td colspan="9" margin-left="-50px">The receipient is required to account for tax as per the previsions of the Federal Decree Law No.(B) of 2017 Value Added Tax.</td>';
            xml += '    </tr>';
            xml += '     <tr>';
            xml += '    <td >2.</td>';
            xml += '     <td colspan="9" margin-left="-50px">For any clarification regarding invoice please contact Financial Dept.in 02 5556038,056-5154948 or authreceivables@rpm.ae</td>';
            xml += '    </tr>';
            xml += '    </table>';
            xml += '  ';
            xml += '        <table style="width:100%;">';
            xml += '    <tr style="width:100%;padding-top: 30px;">';
            xml += '        <td align="left" style="width:40%;">';
            xml += '            <table>';
            xml += '            <tr>';
            xml += '                    <td align="center"></td>';
            xml += '                </tr>';
            xml += '                <tr>';
            xml += '                    <td>___________________</td>';
            xml += '                </tr>';
            xml += '                ';
            xml += '                <tr>';
            xml += '                    <td align="center">';
            xml += '                        <b>Prepared By</b>';
            xml += '                    </td>';
            xml += '                </tr>';
            xml += '            </table>';
            xml += '        </td>';
            xml += '        <td align="right">';
            xml += '            <table align="right">';
            xml += '             <tr>';
            xml += '                    <td align="center"></td>';
            xml += '                </tr>';
            xml += '                <tr>';
            xml += '                    <td>___________________</td>';
            xml += '                </tr>';
            xml += '                 ';
            xml += '                <tr>';
            xml += '                    <td align="center">';
            xml += '                        <b>Recieved By</b>';
            xml += '                    </td>';
            xml += '                </tr>';
            xml += '            </table>';
            xml += '        </td>';
            xml += '    </tr>';
            xml += '</table>';
            xml += '        </td>';
            xml += '        </tr>';
            xml += '</table>';





            xml += ' </body>';
            xml += '</pdf>';
            context.response.renderPdf({
                xmlString: xml
            });


        }

        return {
            onRequest: onRequest
        };
    });

function numberWithCommas(x) {

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

function capitalize(string, a) {

    var tempstr = string.toUpperCase();

    if (a == false || a == undefined)

        return tempstr.replace(tempstr[0], tempstr[0].toUpperCase());

    else {

        return tempstr.split(" ").map(function (i) {

            return i[0].toUpperCase() + i.substring(1)

        }).join(" ");

    }

}

function withDecimal(n) {

    var nums = n.toString().split('.')

    var whole = inWords(nums[0])

    if (nums.length == 2) {

        var fraction = inWords(nums[1])

        return whole.replace('ONLY', '') + 'AND ' + fraction;

    } else {

        return whole;

    }

}
function relaceSlashN(charVal) {
    if (charVal) {
        return charVal.replace("\n", "<br />", "g");
    } else {
        return "";
    }
}

function replaceCharector(charVal) {
    return charVal.replace(/&/g, "&amp;");
}
function relaceCharectorSign(charVal) {

    if (charVal) {

        return charVal.replace(/-/g, " ");

    } else {

        return "";

    }

}

function _IsNullOREmpty(value) {

    if (value == null || value == 'NaN' || value == '' || value == undefined || value == '&nbsp;' || value == 0) {

        return "";

    } else {

        return false;

    }

}
function _isNotNullOREmpty(value) {

    if ((value != 'null') && (value != '') && (value != undefined) && (value != 'NaN')) {

        return true;

    } else {

        return false;

    }

}
