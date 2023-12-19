import {DAEditorModel} from "./da-editor.model";
import {FBEditorModel} from "./fb-editor.model";
import {IGEditorModel} from "./ig-editor.model";
import {PTEditorModel} from "./pt-editor.model";
import {GeneralEditorModel} from "./general-editor.model";

export interface EditorModel {
    general: GeneralEditorModel,
    deviantart: DAEditorModel,
    facebook: FBEditorModel,
    instagram: IGEditorModel,
    pinterest: PTEditorModel
}
