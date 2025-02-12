import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
@Component({
    selector: 'testing-community-banner',
    templateUrl: './testing-community-banner.component.html',
    styleUrl: 'testing-community-banner.component.scss',
    imports: [NgIf, MatButton, MatDialogClose, MatAnchor],
    standalone: true,
})
export class TestingCommunityBannerComponent implements OnInit {
    public closed: boolean;

    public ngOnInit() {
        this.closed = localStorage.getItem('testing-community-banner') === 'closed';
    }

    public closeBanner() {
        const element = document.getElementsByClassName('promo-banner')[0];
        element.parentNode.removeChild(element);
        localStorage.setItem('testing-community-banner', 'closed');
    }
}
