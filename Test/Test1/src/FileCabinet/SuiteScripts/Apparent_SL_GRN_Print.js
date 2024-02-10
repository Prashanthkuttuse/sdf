function printGRNAction(request, response) {
    var renderer = nlapiCreateTemplateRenderer();
    var recID = request.getParameter("recordID");
    // nlapiLogExecution('Debug', 'Transaction', 'Type : ' + recID);
    var renderer = nlapiCreateTemplateRenderer();


    // item Recepit REC LOad
    var res = nlapiLoadRecord("itemreceipt", recID);

    var grnRef = res.getLineItemCount("tranid");
    nlapiLogExecution('Debug', 'grnRef', + grnRef);



    var count = res.getLineItemCount("item");
    nlapiLogExecution('Debug', 'count', + count);

    var createdFrom = res.getLineItemCount("createdfrom");
    nlapiLogExecution('Debug', 'createdFrom', + createdFrom);

    var memo = res.getLineItemCount("memo");
    nlapiLogExecution('Debug', 'memo', + memo);

    var invRef = res.getLineItemCount("custbody_rpm_inv_ref");
    nlapiLogExecution('Debug', 'invRef', + invRef);

    var invDate = res.getLineItemCount("custbody_rpm_so_inv_date");
    nlapiLogExecution('Debug', 'invDate', + invDate);
    var invidate = format.parse({
        value: new Date(invDate),
        type: format.Type.DATE,
    });
    log.debug("date--------", date);

    invidate = format.format({
        value: invidate,
        type: format.Type.DATE
    });
    log.debug("date+++++++++++++", date);


    var itemRecSub = res.getLineItemCount("subsidiary");
    nlapiLogExecution('Debug', 'itemRecSub', + itemRecSub);

    // po rec
    var resRec = nlapiLoadRecord("purchaseorder", createdFrom);

    var poAddress = resRec.getLineItemCount("billaddress");
    nlapiLogExecution('Debug', 'poAddress', + poAddress);

    var poDate = resRec.getLineItemCount("trandate");
    nlapiLogExecution('Debug', 'poDate', + poDate);


    var date = format.parse({
        value: new Date(poDate),
        type: format.Type.DATE,
    });
    log.debug("date--------", date);

    date = format.format({
        value: date,
        type: format.Type.DATE
    });
    log.debug("date+++++++++++++", date);

    var poRef = resRec.getLineItemCount("tranid");
    nlapiLogExecution('Debug', 'poRef', + poRef);


























    var line_item_count = res.getLineItemCount("item");
    var invDetails = res.getLineItemCount("item");
    nlapiLogExecution('Debug', 'invDetails', + invDetails);
    var entity_name = res.getFieldText("entity");
    nlapiLogExecution('Debug', 'entity_name', +entity_name);
    var createdfrom = res.getFieldValue('createdfrom');
    nlapiLogExecution('Debug', 'createdfrom', +createdfrom);
    var recordtype = nlapiLookupField('transaction', createdfrom, 'recordtype');
    nlapiLogExecution('Debug', 'recordtype', +recordtype);
    if (recordtype == "") {
        recordtype = "vendor"
    }
    var resRecord = nlapiLoadRecord(recordtype, createdfrom);
    nlapiLogExecution('Debug', 'resRecord', +resRecord);
    var entity = resRecord.getFieldValue("entity");
    nlapiLogExecution('Debug', 'entity', +entity);

    var rectypeTax = nlapiLookupField('vendor', entity, 'vatregnumber');
    nlapiLogExecution('Debug', 'rectypeTax', +rectypeTax);
    var rectypeTaxOther = nlapiLookupField('customer', entity, 'vatregnumber');
    nlapiLogExecution('Debug', 'rectypeTaxOther', +rectypeTaxOther);


    template = '';
    template += '<?xml version=\"1.0\"?><!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\"> ';
    template += '<pdf> ';
    template += '<head> ';
    template += '<link name=\"NotoSans\" type=\"font\" subtype=\"truetype\" src=\"${nsfont.NotoSans_Regular}\" src-bold=\"${nsfont.NotoSans_Bold}\" src-italic=\"${nsfont.NotoSans_Italic}\" src-bolditalic=\"${nsfont.NotoSans_BoldItalic}\" bytes=\"2\" /> ';
    template += '<#';



    template += 'if .locale == \"zh_CN\"> ';
    template += '<link name=\"Calibri-font\" type=\"font\" subtype=\"opentype\" src=\"https://8333928.app.netsuite.com/core/media/media.nl?id=585&amp;c=8333928&amp;h=FZD2q8uD6Mr19X-iblVKwJBmAP-lFawbpn6r3X-verwfw8UI&amp;_xt=.ttf\" src-bold=\"https://8333928.app.netsuite.com/core/media/media.nl?id=585&amp;c=8333928&amp;h=FZD2q8uD6Mr19X-iblVKwJBmAP-lFawbpn6r3X-verwfw8UI&amp;_xt=.ttf\" bytes=\"2\" />  '

    template += '<link name=\"NotoSansCJKsc\" type=\"font\" subtype=\"opentype\" src=\"${nsfont.NotoSansCJKsc_Regular}\" src-bold=\"${nsfont.NotoSansCJKsc_Bold}\" bytes=\"2\" /> ';

    template += '<#elseif .locale == \"zh_TW\"> ';
    template += '<link name=\"NotoSansCJKtc\" type=\"font\" subtype=\"opentype\" src=\"${nsfont.NotoSansCJKtc_Regular}\" src-bold=\"${nsfont.NotoSansCJKtc_Bold}\" bytes=\"2\" /> ';

    template += '<#elseif .locale == \"ja_JP\"> ';
    template += '<link name=\"NotoSansCJKjp\" type=\"font\" subtype=\"opentype\" src=\"${nsfont.NotoSansCJKjp_Regular}\" src-bold=\"${nsfont.NotoSansCJKjp_Bold}\" bytes=\"2\" /> ';

    template += '<#elseif .locale == \"ko_KR\"> ';
    template += '<link name=\"NotoSansCJKkr\" type=\"font\" subtype=\"opentype\" src=\"${nsfont.NotoSansCJKkr_Regular}\" src-bold=\"${nsfont.NotoSansCJKkr_Bold}\" bytes=\"2\" /> ';

    template += '<#elseif .locale == \"th_TH\"> ';
    template += '<link name=\"NotoSansThai\" type=\"font\" subtype=\"opentype\" src=\"${nsfont.NotoSansThai_Regular}\" src-bold=\"${nsfont.NotoSansThai_Bold}\" bytes=\"2\" /> ';

    template += '</#if> ';
    template += '<macrolist> ';
    template += '<macro id=\"nlheader\"> ';
    template += ' <#if companyInformation.logoUrl?has_content> ';
    template += '<table class=\"header\" style=\"width: 100%;\"> ';
    template += '<tr> ';
    template += ' ';
    template += ' ';
    template += '<td padding-left=\"-40px\" align=\"left\" valign=\"top\" width=\"100%\"> ';
    template += ' ';
    template += '                                            <img src=\"${companyInformation.logoUrl}\" style=\"width:96%;height:120px;position:absolute;top:10px;padding-left:20px;padding-right:10px;\" /> ';
    template += ' ';
    template += '                                        </td> ';
    template += '</tr> ';
    template += '</table> ';
    template += '</#if> ';
    template += '</macro> ';
    template += '<#if (record.status == \"Pending Approval\") > ';
    template += '                            <macro id=\"watermark\"> ';
    template += '<div rotate=\"-45\" style=\"margin-top:400px;margin-left:50px;margin-right:50px;z-index:999;\" font-size=\"20pt\" color=\"#C0C0C0\"> ';
    template += '<p>PENDING FOR APPROVAL</p> ';
    template += '</div> ';
    template += '</macro> ';
    template += '</#if> ';
    template += ' ';
    template += '                            <macro id=\"nlfooter\"> ';
    template += '                                <table class=\"footer\" style=\"width: 100%;\"> ';
    template += '                                    <tr> ';
    var imgURLForPDF = "https://8333928.app.netsuite.com/core/media/media.nl?id=14&c=8333928&h=1UzcdbKSXTD3nPIoHXJRISTAwB5zwjNfecnlPDWqHhh8hZvT"
    function relaceCharector(charVal) {
        if (charVal) {
            return charVal.replace(/&/g, "&amp;");
        } else {
            return "";
        }
    }
    var logoUrl = relaceCharector(imgURLForPDF);
    template += '                                        <td align=\"left\" style=\"width:60%;\"> ';
    template += '                                            <img src=\"' + logoUrl + '\" style=\"width:100%;height:150px;\" /> ';
    template += '                                        </td> ';
    template += '                                     </tr> ';
    template += '                                 </table> ';
    template += '                                 <table style="width: 100%;"> ';
    template += '                                     <tr> ';
    template += '                                        <td align="right"><pagenumber/> of <totalpages/></td>';

    template += '                                </tr> ';
    template += ' ';
    template += ' ';
    template += ' ';
    template += '                            </table> ';
    template += '                        </macro> ';
    template += '                    </macrolist> ';
    template += '                    <style type=\"text/css\">span, table ';
    template += '{                        <#if .locale=="zh_CN">font-family: stsong, sans-serif; ';
    template += '                            <#elseif .locale=="zh_TW">font-family: msung, sans-serif; ';
    template += '                                <#elseif .locale=="ja_JP">font-family: heiseimin, sans-serif; ';
    template += '                                    <#elseif .locale=="ko_KR">font-family: hygothic, sans-serif; ';
    template += '                                        <#elseif .locale=="ru_RU">font-family: verdana; ';
    template += '                                            <#else>font-family: sans-serif; ';
    template += '                                            </#if>font-size: 9pt; ';
    template += '		table-layout: fixed; ';
    template += '		} ';
    template += '		th ';
    template += '{		font-weight: bold; ';
    template += '		font-size: 8.5pt; ';
    template += '		padding-top: 2px; ';
    template += '		vertical-align: middle; ';
    template += '		/*padding: 3px 6px 10px;*/ ';
    template += '		/*background-color: #e3e3e3; ';
    template += '		color: #333333;*/ ';
    template += '		} ';
    template += '		b ';
    template += '{		font-weight: bold; ';
    template += '		color: #333333; ';
    template += '		} ';
    template += '		table.header td ';
    template += '{		padding: 0; ';
    template += '		font-size: 10pt; ';
    template += '		} ';
    template += '		table.footer td ';
    template += '{		padding: 0; ';
    template += '		font-size: 8pt; ';
    template += '		} ';
    template += '		#itemtable th p ';
    template += '{		vertical-align: text-top !important; ';
    template += '		text-align: center !important; ';
    template += '		} ';
    template += '		#itemtable ';
    template += '{		font-size: 8.5pt !important; ';
    template += '		border: 1px solid #000000 ';
    template += '		} ';
    template += '		table.total ';
    template += '{		page-break-inside: avoid; ';
    template += '		} ';
    template += '		tr.totalrow ';
    template += '{		background-color: #e3e3e3; ';
    template += '		line-height: 200%; ';
    template += '		} ';
    template += '		td.totalboxtop ';
    template += '{		font-size: 12pt; ';
    template += '		background-color: #e3e3e3; ';
    template += '		} ';
    template += '		span.title ';
    template += '{		font-size: 28pt; ';
    template += '		} ';
    template += '		.smallTitle ';
    template += '{		font-size: 9pt; ';
    template += '		} ';
    template += '		span.number ';
    template += '{		font-size: 16pt; ';
    template += '		text-align:center; ';
    template += '		} ';
    template += '		span.itemname ';
    template += '{		font-weight: bold; ';
    template += '		line-height: 150%; ';
    template += '		} ';
    template += '		hr ';
    template += '{		width: 100%; ';
    template += '		color: #d3d3d3; ';
    template += '		background-color: #d3d3d3; ';
    template += '		height: 1px; ';
    template += '		} ';
    template += '		table.smalltext tr td ';
    template += '{		font-size: 8pt; ';
    template += '		} ';
    template += '		/*table.itemtable th{ ';
    template += 'border-bottom: 10px #ffc966; ';
    template += 'border-color: yellow; ';
    template += '}*/ ';
    template += '		p.alignR ';
    template += '{		text-align: right !important; ';
    template += '		} ';
    template += '		p.alignL ';
    template += '{		text-align: left !important; ';
    template += '		} ';
    template += '		p.alignC ';
    template += '{		text-align: center !important; ';
    template += '		} ';
    template += '		.td_right_line ';
    template += '{		/*border-right: 1px solid #f4f4f4;*/ ';
    template += '		border-right :1px solid #000000; ';
    template += '		} ';
    template += '		.td_bottom_line ';
    template += '{		border-bottom: 1px solid #000000; ';
    template += '		} ';
    template += '		.td_top_line ';
    template += '{		/*border-top :1px solid #f4f4f4;*/ ';
    template += '		border-top :1px solid #000000; ';
    template += '		} ';
    template += '		.title ';
    template += '{		font-weight: bold; ';
    template += '		align:center!important; ';
    template += '		font-size:17pt; ';
    + '    font-family: Calibri-font;'
    template += '		} ';
    // + '    .title '
    // + '{        font-weight: bold; '
    // + '     align:center!important; '
    // + '    font-size:17pt; '
    // + '  line-height: 150%; '
    // + '    font-family: Calibri-font,sans-serif;'
    // + '   } '
    template += '		.footer-img ';
    template += '{		/*width: 100%; ';
    template += '		height: 20%;*/ ';
    template += '		top: 0px; ';
    template += '		right: 0px; ';
    template += '		left: 0px; ';
    template += '		bottom: 0px; ';
    template += '		} ';
    template += '		.footer ';
    template += '{		margin-left:-45px; margin-right:-60px; margin-bottom:-115px; ';
    template += '		} ';
    template += '		.td_left_line ';
    template += '{		/*border-right: 1px solid #f4f4f4;*/ ';
    template += '		border-left :1px solid #000000; ';
    template += '		} ';
    template += '		.maintbl ';
    template += '{		border:0.5px solid #000000; ';
    template += '		} ';
    template += '		.footertbl ';
    template += '{		border:0.5px solid #000000; ';
    template += '		border-top: 0px !important; ';
    template += '		} ';
    template += '		.footertbl2 ';
    template += '{		 ';
    template += '		/*border:0.5px solid #000000;*/ ';
    template += '		border-left: 0.5px solid #000000; ';
    template += '		border-right: 0.5px solid #000000; ';
    template += '		border-top: 0.25px !important; ';
    template += '		} ';
    template += '		.pad_left ';
    template += '{		padding-left: 5px!important; ';
    template += '		} ';
    template += '		th,td ';
    template += '{		padding:4px; ';
    template += '		} ';
    template += '		                                                                                                                                                                                                                            <!--  .td_top_line td ';
    template += '{		padding-left: 5px!important; ';
    template += '		} --> ';
    template += '		td img ';
    template += '{		max-width:100%; ';
    template += '		 ';
    template += '		} ';
    template += '                                        </style> ';
    template += '                                    </head> ';
    template += '                                    <body header=\"nlheader\" background-macro=\"watermark\" header-height=\"15%\" footer=\"nlfooter\" footer-height=\"15%\" padding=\"0.25in 0.5in 0.5in 0.5in\" size=\"A4\">';
    template += '    <table width="100%" style="margin-top:60px;">';
    template += '    <tr>';
    template += '    <td align="center" class="title">GOODS RECEIPT NOTE</td>';
    template += '    </tr>';
    template += '    </table>';
    template += '    ';
    template += ' <table style="width: 100%;border:1px Solid black;">';
    template += '    <tr>';
    template += '        <td>';
    template += '            <table style="width:100%">';


    template += '             <#if record.createdfrom.tranid?has_content>';
    template += '  ';
    template += '                   <tr>';
    template += '                      <td style="width:26%"><b>GRN No</b></td>';
    template += '                      <td style="width:2%"><b>:</b></td>';
    template += '                      <td style="width:72%"> <b>' + (grnRef) + '</b></td>';
    template += '                 </tr>';
    // }
    template += '                 </#if>';


    template += '             <#if record.createdfrom.tranid?has_content>';

    template += '                 <tr>';
    template += '                    <td style="width:26%"><b>Supplier</b></td>';
    template += '                    <td style="width:2%"><b>:</b></td>';
    template += '                    <td style="width:72%"><b>${record.entity}</b></td>';
    template += '                </tr>';
    template += '                 </#if>';




    template += '  ';
    template += '                  <tr>';
    template += '                     <td style="width:26%"><b>Remarks</b></td>';
    template += '                     <td style="width:2%"><b>:</b></td>';
    template += '                     <td style="width:72%"> <b>' + memo + '</b></td>';
    template += '                 </tr>';
    // }
    template += '  ';
    template += '  </table>';
    template += '     </td>';



    template += '         <td style="border-left:1px Solid Black;">';
    template += '              <table style="width:100%">';
    template += '  ';
    // if (poRef) {
    template += '  ';
    template += '                 <tr>';
    template += '                     <td style="width:50%"><b > PO# </b></td>';
    template += '                     <td style="width:2%">  <b >&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b></td>';
    template += '                     <td style="width:48%"> <b > ' + poRef + '</b></td>';
    template += '                 </tr>';
    // }
    xml += ''
    // if (date) {
    xml += ''
    template += '                 <tr>';
    template += '                     <td style="width:40%"><b > PO Date</b></td>';
    template += '                     <td style="width:2%"><b >&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b></td>';
    template += '                     <td style="width:58%"> <b >' + date + '</b></td>';
    template += '                 </tr>';
    // }
    template += '  ';
    // if (invRef) {
    xml += ''
    template += '                 <tr>';
    template += '                     <td style="width:34%"><b > Invoice No</b></td>';
    template += '                     <td style="width:2%"><b >&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b></td>';
    template += '                     <td style="width:64%"> <b >' + invRef + '</b></td>';
    template += '                 </tr>';
    // }
    template += '  ';
    // if (invidate) {
    template += '  ';
    template += '                 <tr>';
    template += '                     <td style="width:34%"><b >Invoice Date</b></td>';
    template += '                     <td style="width:2%"><b >&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b></td>';
    template += '                     <td style="width:64%"> <b >' + invidate + '</b></td>';
    template += '                 </tr>';
    // }

    template += '  ';
    template += '             </table>';
    template += '         </td>';
    template += '         </tr>';
    template += '         </table>';
    template += '  <#if record.item?has_content>';
    template += '  <table  class="itemtable" style="width: 100%; margin-top: 10px;border-top:1px Solid black;border-left:1px Solid black;border-right:1px Solid black;">';
    template += '      <#list record.item as item><#if item_index==0>';
    // template += '          <thead>';
    template += ' <tr  style="padding-bottom: 0px;"> ';
    template += '                 <td align="center" width="6%" class="td_left_line td_right_line td_top_line td_bottom_line " ><p align="left" style="color:#0D98BA;"> ';
    template += '                     <b>SI#</b></p> ';
    template += '                 </td> ';
    template += '                 <td align="center" width="15%" class="td_right_line td_top_line td_bottom_line  colorId" style=" color:#0D98BA"><p align="left" style="color:#0D98BA;"> ';
    template += '                    <b >Item Code</b></p>';
    template += '                 </td> ';
    template += '                 <td align="center" width="26%" class="td_right_line td_top_line td_bottom_line colorId" style=" color:#0D98BA"><p align="center" style="color:#0D98BA;"> ';
    template += '                    <b >Item Description</b></p>';
    template += '                 </td> ';
    template += '                 <td align="center"  width="8%" class="td_right_line td_top_line td_bottom_line colorId" style=" color:#0D98BA"><p align="center" style="color:#0D98BA;"> ';
    template += '                    <b >Quantity</b></p>';
    template += '                 </td> ';
    template += '                 <td align="center"  width="5%" class="td_right_line td_top_line td_bottom_line colorId" style=" color:#0D98BA"><p align="center" style="color:#0D98BA;"> ';
    template += '                     <b >Rate</b></p>';
    template += '                 </td> ';
    template += '                 <td align="right" width="7%" class="td_right_line td_top_line td_bottom_line colorId" style=" color:#0D98BA"> ';
    template += '                    <p align="right"><b>VAT Rate<br/></b></p>';
    template += '                 </td> ';
    template += '                 <td align="right" width="11%" class="td_right_line td_top_line td_bottom_line colorId" style=" color:#0D98BA"><p align="right" style="color:#0D98BA;"> ';
    template += '                     <b >VAT Amount</b></p> ';
    template += '                 </td> ';
    template += '                 <td align="right" width="11%" class="td_right_line td_top_line td_bottom_line colorId" style=" color:#0D98BA"> ';
    template += '                     <p align="right"> <b >Amount<br/></b></p>';
    template += '                 </td> ';

    template += '             </tr> ';
    // template += '          </thead>';
    template += '              </#if>';
    template += '   <tr class="td_bottom_line">';
    template += '                     <td align="center" >${item_index + 1}</td>';
    template += '                      <td align="left" class="td_left_line ">${item.description}</td>';
    template += '                      <td align="center" class="td_left_line ">${item.unitsdisplay}</td>';
    template += '                      <td align="left" class="td_left_line ">${item.custcolcustid_delivery_location}</td>';
    template += '                      <td align="left" class="td_left_line ">${item.custcolcustid_delivery_time}</td>';
    template += '                      <td align="left" class="td_left_line ">${item.custcolcustid_qa_qc}</td>';
    template += '                      <td align="left" class="td_left_line ">${item.custcolcustid_inspection_details}</td>';
    template += '     </tr> ';
    template += '      </#list> ';

    template += '      </table>';
    template += '  </#if>';

    template += '<table style="width:100%;">';
    template += ' <tr>';
    template += '                        <td align="center">&nbsp;</td>';
    template += '                    </tr>';
    template += '                                                                        <tr style="width:100%;padding-top: 20px;">';
    template += '                                                                            <td align="left" style="width:40%;">';
    template += '                                                                                <table>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td>';
    template += '                                                                                            <b>Received By</b>';
    template += '                                                                                        </td>';
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td>';
    template += '                                                                                            <b>Signature</b>';
    template += '                                                                                        </td>';
    template += '                                                                                        <td><b>:</b></td>'
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td>';
    template += '                                                                                            <b>Name</b>';
    template += '                                                                                        </td>';
    template += '                                                                                        <td><b>:</b></td>'
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td>';
    template += '                                                                                            <b>Mobile Number</b>';
    template += '                                                                                        </td>';
    template += '                                                                                        <td><b>:</b></td>'
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td>';
    template += '                                                                                            <b>Date</b>';
    template += '                                                                                        </td>';
    template += '                                                                                        <td><b>:</b></td>'
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td></td>';
    template += '                                                                                        <td></td>'
    template += '                                                                                    </tr>';
    template += '                                                                                </table>';
    template += '                                                                            </td>';



    //         template += '                                                                            <td align="center">'; 
    //         + '                                <table style=\"width: 100%; color:blue;\"> '
    // + '                                    <tr> ';
    //         var imgURLForPDF = "https://8333928.app.netsuite.com/core/media/media.nl?id=577&c=8333928&h=L0J-EGfDAq_nuVkzVShuE8TOqg2xuy9UQzu6r62u4CueEbhW";
    //         nlapiLogExecution('DEBUG', 'url', imgURLForPDF)
    //         function relaceCharector(charVal) {
    //         if (charVal) {
    //             return charVal.replace(/&/g, "&amp;");
    //         } else {
    //             return "";
    //         }
    //         }
    //         var logoUrl = relaceCharector(imgURLForPDF);
    //         template +='';


    //        + '<td align=\"center\" width=\"100%\">assdf '
    // + '                                            <img src=\"https://8333928.app.netsuite.com/core/media/media.nl?id=577&amp;c=8333928&amp;h=L0J-EGfDAq_nuVkzVShuE8TOqg2xuy9UQzu6r62u4CueEbhW\" style=\"width:20%;height:80px;\" />'
    // + '                                       </td>';
    // '                                  </tr> '
    // +'                               </table> '

    //         template += '                                                                                    </td>';

    template += '                                                                             <td>';
    template += '                                                                     <table style=\"width:100%;\"  align="center">';
    template += '                                                                         <tr>';
    template += '                                                                             <td align="center" style=\"width:30%;\">';
    template += '                                            <img src=\"https://8333928.app.netsuite.com/core/media/media.nl?id=577&amp;c=8333928&amp;h=L0J-EGfDAq_nuVkzVShuE8TOqg2xuy9UQzu6r62u4CueEbhW\" style=\"width:220px;height:80px;padding-right:-180px;padding-top:10px\" /> ';

    template += '                                                                             </td>';
    template += '                                                                         </tr>';
    template += '                                                                     </table>';

    template += '                                                                             </td>';



    template += '                                                                            <td align="right">';
    template += '                                                                                <table align="right" style=\"padding-top:50px\">';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td style=\"padding-left:30px;\"><b>Approved By</b></td>';
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td align="center">${record.custbody_created_by}</td>';
    template += '                                                                                    </tr>';
    template += '                                                                                    <tr>';
    template += '                                                                                        <td align="center" style=\"padding-top:30px\">';
    template += '                                                                                             ___________________';
    template += '                                                                                         </td>';
    template += '                                                                                     </tr>';
    template += '                                                                                 </table>';
    template += '                                                                             </td>';
    template += '                                                                         </tr>';
    template += '                                                                     </table>';


    // template += '                                                                     <table style=\"width:100%;\"  align="center">';
    // template += '                                                                         <tr>';
    // template += '                                                                             <td align="center" style=\"width:30%;\">';
    // template += '                                            <img src=\"https://8333928.app.netsuite.com/core/media/media.nl?id=577&amp;c=8333928&amp;h=L0J-EGfDAq_nuVkzVShuE8TOqg2xuy9UQzu6r62u4CueEbhW\" style=\"width:30%;height:5px;padding-left:100px;padding-top:-100px\" /> ';

    // template += '                                                                             </td>';
    // template += '                                                                         </tr>';
    // template += '                                                                     </table>';



    template += '</body>';
    template += '           </pdf>';
    renderer.setTemplate(template);
    renderer.addRecord('record', res);
    var xml = renderer.renderToString();
    var file = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'GRN_' + res.getFieldValue("id") + '.pdf', 'inline');
    response.write(file.getValue());
}

