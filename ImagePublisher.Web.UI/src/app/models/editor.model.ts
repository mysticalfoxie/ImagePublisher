import {DAEditorModel} from "./da-editor.model";
import {FBEditorModel} from "./fb-editor.model";
import {IGEditorModel} from "./ig-editor.model";
import {PTEditorModel} from "./pt-editor.model";

export interface EditorModel {
    deviantart: DAEditorModel,
    facebook: FBEditorModel,
    instagram: IGEditorModel,
    pinterest: PTEditorModel
}
