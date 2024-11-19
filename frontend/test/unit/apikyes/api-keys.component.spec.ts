import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiKeysComponent } from '../../../src/app/apikeys/api-keys.component';
import { ApiKeysModule } from '../../../src/app/apikeys/api-keys.module';
import { ApiKeysService } from '../../../src/app/apikeys/api-keys.service';
import { RevokeKeyDialogComponent } from '../../../src/app/apikeys/revoke-key-dialog/revoke-key-dialog.component';
import { ApiKey } from '../../../src/app/apikeys/types';
import { AlertsService } from '../../../src/app/shared/alert/alerts.service';
import { RestService } from '../../../src/app/updatesweb/rest.service';
import SpyObj = jasmine.SpyObj;

describe('ApiKeysComponent', () => {
    let component: ApiKeysComponent;
    let fixture: ComponentFixture<ApiKeysComponent>;
    let apiKeysServiceMock: SpyObj<ApiKeysService>;
    let matDialogMock: SpyObj<MatDialog>;

    const apiKeysResponse: ApiKey[] = [
        {
            expirationDate: '2024-01-01',
            lastUsed: '',
            name: 'my key name',
            accessKey: 'accessKey',
            secretKey: 'secretKey',
        },
    ];

    beforeEach(waitForAsync(() => {
        apiKeysServiceMock = jasmine.createSpyObj<ApiKeysService>('ApiKeysService', ['getApiKeys', 'deleteApiKey']);
        matDialogMock = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

        void TestBed.configureTestingModule({
            imports: [ApiKeysModule, MatDialogModule, NoopAnimationsModule],
            declarations: [ApiKeysComponent],
            providers: [
                { provide: ApiKeysService, useValue: apiKeysServiceMock },
                { provide: RestService, useValue: {} },
                { provide: AlertsService, useValue: {} },
                { provide: MatDialog, useValue: matDialogMock },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        apiKeysServiceMock.getApiKeys.and.returnValue(of(apiKeysResponse));
        fixture = TestBed.createComponent(ApiKeysComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should load api keys on init', () => {
        expect(component.dataSource.data).toEqual(apiKeysResponse);
    });

    it('should revoke api key when accepting modal', () => {
        apiKeysServiceMock.getApiKeys.and.returnValue(of([]));
        apiKeysServiceMock.deleteApiKey.and.returnValue(of(''));
        // @ts-ignore we are only interested on mocking the closing action
        matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });

        component.openRevokeDialog('myAccessKey');

        expect(matDialogMock.open).toHaveBeenCalledWith(RevokeKeyDialogComponent);
        expect(apiKeysServiceMock.deleteApiKey).toHaveBeenCalledWith('myAccessKey');
        expect(component.dataSource.data).toEqual([]);
    });

    it('should not revoke api key when cancelling modal', () => {
        // @ts-ignore we are only interested on mocking the closing action
        matDialogMock.open.and.returnValue({ afterClosed: () => of(false) });

        component.openRevokeDialog('myAccessKey');

        expect(matDialogMock.open).toHaveBeenCalledWith(RevokeKeyDialogComponent);
        expect(apiKeysServiceMock.deleteApiKey).not.toHaveBeenCalledWith('myAccessKey');
    });
});
