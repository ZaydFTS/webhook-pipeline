import { ActionType } from "../../types/pipeline.types";
import { filterDataAction } from "./filterData.action";
import { httpEnrichAction } from "./httpEnrich.action";
import { jsonXmlConvertAction } from "./jsonXml.action";
import { transformFormatAction } from "./transformFormat.action";





export const actionMap:
    Record<ActionType, (
        payload: Record<string, unknown>,
        config: any,
    ) => Promise<Record<string, unknown>>> = {
    'filter_data': filterDataAction,
    'transform_format': transformFormatAction,
    'http_enrich': httpEnrichAction,
    'Json_XML_convert': jsonXmlConvertAction,
}