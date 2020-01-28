import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { PoPageCustomizationService } from './po-page-customization.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { PoPageOptions } from './po-page-options';

const originalPageOptions: PoPageOptions = {
  title: 'Original Title',
  breadcrumb: {
    items: [
      { label: 'Home' },
      { label: 'Hiring processes' }
    ]
  },
  actions: [
    { label: 'Feature 1', url: '/feature1' },
    { label: 'Feature 2', url: '/feature2' }
  ],
  filters: [
    { property: 'filter1' },
    { property: 'filter2' }
  ]
};

const mergedPageOptions: PoPageOptions = {
  title: 'New Title',
  breadcrumb: {
    items: [
      { label: 'Test' },
      { label: 'Test2' }
    ]
  },
  actions: [
    { label: 'Feature 1', url: '/new-feature1' },
    { label: 'Feature 2', url: '/feature2' },
    { label: 'Feature 3', url: '/new-feature3' }
  ],
  filters: [
    { property: 'filter1' },
    { property: 'filter2' },
    { property: 'filter3' }
  ]
};

const newPageOptions: PoPageOptions = {
  title: 'New Title',
  breadcrumb: {
    items: [
      { label: 'Test' },
      { label: 'Test2' }
    ]
  },
  actions: [
    { label: 'Feature 1', url: '/new-feature1' },
    { label: 'Feature 3', url: '/new-feature3' }
  ],
  filters: [
    { property: 'filter1' },
    { property: 'filter3' }
  ]
};

function customOptionFunctionMock(): PoPageOptions {
  return newPageOptions;
}

describe('PoPageCustomizationService:', () => {
  let poPageCustomizationService: PoPageCustomizationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageCustomizationService]
    });

    poPageCustomizationService = TestBed.get(PoPageCustomizationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poPageCustomizationService instanceof PoPageCustomizationService).toBeTruthy();
  });

  describe('Methods: ', () => {
    describe('changeOriginalOptionsToNewOptions:', () => {

      it('should change a object props based on new option', () => {
        const objectToChange = {
          stringTest: 'Original Title',
          numberTest: 2,
          objectTest: {prop3: 'Test'},
          arrayTest: [1, 2, 3],
          noChangeTest: 'No Change!',
          nullObj: 'test'
        };

        const newOption = {
          stringTest: 'New Title',
          numberTest: 5,
          objectTest: {prop3: 'new'},
          arrayTest: [7, 8, 9],
          noDiference: 'it will not go to original object!',
          nullObj: undefined
        };

        const result = {
          stringTest: 'New Title',
          numberTest: 5,
          objectTest: {prop3: 'new'},
          arrayTest: [7, 8, 9],
          noChangeTest: 'No Change!',
          nullObj: 'test'
        };

        poPageCustomizationService.changeOriginalOptionsToNewOptions(objectToChange, newOption);
        expect(objectToChange).toEqual(result);
      });
    });

    describe('getCustomOptions:', () => {
      it('should get customized option from a function', async(() => {
        poPageCustomizationService
          .getCustomOptions(customOptionFunctionMock, originalPageOptions)
          .subscribe(optionResult => {
            expect(optionResult).toEqual(mergedPageOptions);
          });
      }));

      it('should get customized option from a url', fakeAsync(() => {
        testUrl(originalPageOptions, newPageOptions, mergedPageOptions);
      }));

      it('should keep the original title and breadcrumb if url do not return it', fakeAsync(() => {
        const originalOption: PoPageOptions = {
          title: 'Original Title',
          breadcrumb: {
            items: [
              { label: 'Home' },
              { label: 'Hiring processes' }
            ]
          }
        };
        const newOption: PoPageOptions = {
          filters: [
            { property: 'filter1' },
            { property: 'filter3' }
          ]
        };
        const mergedOptions: PoPageOptions = {
          title: 'Original Title',
          breadcrumb: {
            items: [
              { label: 'Home' },
              { label: 'Hiring processes' }
            ]
          },
          filters: [
            { property: 'filter1' },
            { property: 'filter3' }
          ]
        };

        testUrl(originalOption, newOption, mergedOptions);

      }));

      it('should keep the original action if url do not return it', fakeAsync(() => {
        const originalOption: PoPageOptions = {
          actions: [
            { label: 'Feature 1', url: '/feature1' },
            { label: 'Feature 2', url: '/feature2' }
          ]
        };
        const newOption: PoPageOptions = {};
        const mergedOptions: PoPageOptions = {
          actions: [
            { label: 'Feature 1', url: '/feature1' },
            { label: 'Feature 2', url: '/feature2' }
          ]
        };

        testUrl(originalOption, newOption, mergedOptions);
      }));

      it('should keep the original filter if url do not return it', fakeAsync(() => {
        const originalOption: PoPageOptions = {
          filters: [
            { property: 'filter1' },
            { property: 'filter3' }
          ]
        };
        const newOption: PoPageOptions = {};
        const mergedOptions: PoPageOptions = {
          filters: [
            { property: 'filter1' },
            { property: 'filter3' }
          ]
        };

        testUrl(originalOption, newOption, mergedOptions);
      }));

      function testUrl(originalOption: PoPageOptions, newOption: PoPageOptions, mergedOptions: PoPageOptions) {
        const url = '/test/api';
        poPageCustomizationService
          .getCustomOptions(url, originalOption)
          .subscribe(optionResult => {
            expect(optionResult).toEqual(mergedOptions);
          });

        const req = httpMock.expectOne(request =>
          request.method === 'POST' && request.url === url
        );
        expect(req.request.method).toBe('POST');

        req.flush(newOption);

        tick();
      }
    });
  });
});
