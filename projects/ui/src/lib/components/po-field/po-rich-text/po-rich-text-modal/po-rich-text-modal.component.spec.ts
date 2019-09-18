import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as UtilsFunction from '../../../../utils/util';
import { configureTestSuite } from '../../../../util-test/util-expect.spec';

import { PoButtonGroupModule } from '../../../po-button-group';
import { PoFieldModule } from '../../po-field.module';
import { PoModalModule } from '../../../po-modal/po-modal.module';
import { PoRichTextModalComponent } from './po-rich-text-modal.component';
import { PoRichTextModalType } from '../enums/po-rich-text-modal-type.enum';

describe('PoRichTextModalComponent:', () => {
  let component: PoRichTextModalComponent;
  let fixture: ComponentFixture<PoRichTextModalComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        PoButtonGroupModule,
        PoModalModule,
        PoFieldModule
      ],
      declarations: [],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextModalComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {

    it(`isUploadValid: should return true if uploadModel is not empty`, () => {
      component.uploadModel = [ 'fileMock' ];

      expect(component['isUploadValid']).toBeTruthy();
    });

    it(`isUploadValid: should return false if uploadModel is undefined`, () => {
      component.uploadModel = undefined;

      expect(component['isUploadValid']).toBeFalsy();
    });

    it(`isUploadValid: should return false if uploadModel is an empty array`, () => {
      component.uploadModel = [];

      expect(component['isUploadValid']).toBeFalsy();
    });

    it(`isUrlValid: should return true if url is valid`, () => {
      component.modalImageForm = <any> {
        valid: true
      };
      component.urlImage = 'http://test.com';

      expect(component['isUrlValid']).toBeTruthy();
    });

    it(`isUrlValid: should return false if url is empty`, () => {
      component.modalImageForm = <any> {
        valid: false
      };
      component.urlImage = '';

      expect(component['isUrlValid']).toBeFalsy();
    });

    it(`isUrlValid: should return false if url is invalid`, () => {
      component.modalImageForm = <any> {
        invalid: false
      };
      component.urlImage = 'test';

      expect(component['isUrlValid']).toBeFalsy();
    });

    it('modalCancelAction: should call modal.close and cleanUpFields', () => {
      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'cleanUpFields');

      component.modalCancelAction.action();

      expect(component.modal.close).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
    });

    it('modalConfirmAction: should call insertElementRef', () => {
      spyOn(component, 'insertElementRef');

      component.modalConfirmAction.action();

      expect(component.insertElementRef).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {

    it(`openModal: should call 'saveCursorPosition', 'modal' and 'open'.`, () => {
      const fakeType = PoRichTextModalType.Image;
      spyOn(component, <any>'saveCursorPosition');
      spyOn(component.modal, 'open');

      component.openModal(fakeType);

      expect(component['saveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.open).toHaveBeenCalled();
    });

    it(`convertToBase64: should call 'convertImageToBase64'.`, async () => {
      component.uploadModel = <any> [ { rawFile: <any>'new file' }];
      spyOn(UtilsFunction, 'convertImageToBase64');

      await component['convertToBase64']();

      expect(UtilsFunction.convertImageToBase64).toHaveBeenCalled();
    });

    it(`convertToBase64: shouldn't call 'convertImageToBase64'.`, async () => {
      spyOn(UtilsFunction, 'convertImageToBase64');

      await component['convertToBase64']();

      expect(UtilsFunction.convertImageToBase64).not.toHaveBeenCalled();
    });

    it(`emitCommand: should call 'command' and 'emit'.`, () => {
      const value = 'fakeUrl';
      const command = 'insertImage';
      component.modalType = PoRichTextModalType.Image;
      spyOn(component.command, 'emit');

      component.emitCommand(value);

      expect(component.command.emit).toHaveBeenCalledWith(({command, value}));
    });

    it(`emitCommand: shouldn't call 'command' and 'emit'.`, () => {
      const value = undefined;
      const command = 'insertImage';
      component.modalType = PoRichTextModalType.Image;
      spyOn(component.command, 'emit');

      component.emitCommand(value);

      expect(component.command.emit).not.toHaveBeenCalledWith(({command, value}));
    });

    it(`emitCommand: shouldn't call 'command' and 'emit'.`, () => {
      const value = 'fakeUrl';
      const command = 'insertImage';
      spyOn(component.command, 'emit');

      component.emitCommand(value);

      expect(component.command.emit).not.toHaveBeenCalledWith(({command, value}));
    });

    it(`insertElementRef: should call 'retrieveCursorPosition' and 'modal.close' before 'emitCommand'`, async () => {
      component.modalType = PoRichTextModalType.Image;

      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'retrieveCursorPosition');
      const spyEmitCommand = spyOn(component, 'emitCommand');
      spyOnProperty(component, 'isUrlValid').and.returnValue(true);

      await component.insertElementRef();

      expect(component['retrieveCursorPosition']).toHaveBeenCalledBefore(spyEmitCommand);
      expect(component.modal.close).toHaveBeenCalledBefore(spyEmitCommand);
    });

    it(`insertElementRef: should call 'convertToBase64' if 'urlImage' is undefined and 'modalType' is 'image'.`, async () => {
      component.modalType = PoRichTextModalType.Image;
      component.urlImage = undefined;

      spyOn(component, <any>'convertToBase64');
      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'retrieveCursorPosition');

      await component.insertElementRef();

      expect(component['convertToBase64']).toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });

    it(`insertElementRef: shouldn't call 'convertToBase64' if 'urlImage' is defined and 'modalType' is 'image'.`, async () => {
      const fakeUrlImage = 'test';
      component.urlImage = fakeUrlImage;

      spyOn(component, <any>'convertToBase64');
      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'retrieveCursorPosition');
      spyOn(component, <any>'cleanUpFields');

      await component.insertElementRef();

      expect(component['convertToBase64']).not.toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
    });

    it(`insertElementRef: should call 'emitCommand' with 'urlImage' if 'isUrlValid' returns 'true'.`, async () => {
      spyOn(component, <any>'retrieveCursorPosition');
      const fakeUrlImage = 'test';
      component.urlImage = fakeUrlImage;

      spyOn(component, 'emitCommand');
      spyOnProperty(component, 'isUrlValid').and.returnValue(true);

      await component.insertElementRef();

      expect(component.emitCommand).toHaveBeenCalledWith(fakeUrlImage);
    });

    it(`insertElementRef: should call 'emitCommand' with 'base64Image' if 'isUploadValid' returns 'true'.`, async () => {
      component.modalType = PoRichTextModalType.Image;
      const fakeBase64Image = 'imageBase64';

      spyOn(component, 'emitCommand');
      spyOn(component, <any>'retrieveCursorPosition');
      spyOn(component, 'convertToBase64').and.returnValue(Promise.resolve(fakeBase64Image));
      spyOnProperty(component, 'isUploadValid').and.returnValue(true);

      await component.insertElementRef();

      expect(component.emitCommand).toHaveBeenCalledWith(fakeBase64Image);
    });

    it(`insertElementRef: shouldn't call 'emitCommand' if 'isUploadValid' and 'isUrlValid' returns 'false'.`, async () => {
      spyOn(component, <any>'retrieveCursorPosition');

      spyOn(component, 'emitCommand');
      spyOnProperty(component, 'isUrlValid').and.returnValue(false);
      spyOnProperty(component, 'isUploadValid').and.returnValue(false);

      await component.insertElementRef();

      expect(component.emitCommand).not.toHaveBeenCalled();
    });

    it(`cleanUpFields: should set values to 'urlImage' and 'uploadModel'.`, () => {
      component.upload = <any>{};

      component['cleanUpFields']();

      expect(component.urlImage).toBe(undefined);
      expect(component.uploadModel).toBe(undefined);
    });

    it(`retrieveCursorPosition: should call 'selection.collapse'.`, () => {
      component.savedCursorPosition = [null, 1];

      spyOn(component.selection, 'collapse');

      component['retrieveCursorPosition']();

      expect(component.selection.collapse).toHaveBeenCalled();
    });

    it(`saveCursorPosition: should set value to 'savedCursorPosition'.`, () => {
      const fakeSelection = document.getSelection();
      const expectedValueSaved = [fakeSelection.focusNode, fakeSelection.focusOffset];

      component['saveCursorPosition']();

      expect(component.savedCursorPosition).toEqual(expectedValueSaved);
    });

  });

  describe('Template:', () => {

    it(`should contain 'po-upload-input' if modalType === 'image'`, () => {
      component.modalType = PoRichTextModalType.Image;

      component.modal.open();
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-upload-input')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-input' if modalType !== 'image'`, () => {
      component.modalType = <any>'teste';

      component.modal.open();
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-upload-input')).toBeFalsy();
    });

    it(`should contain 'po-upload-drag-drop' if 'modal.isHidden' is 'false'`, () => {
      component.modalType = PoRichTextModalType.Image;

      component.modal.isHidden = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-drag-drop' if 'modal.isHidden' is 'true'`, () => {
      component.modalType = PoRichTextModalType.Image;

      component.modal.isHidden = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop')).toBeFalsy();
    });
  });

});
