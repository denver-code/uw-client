import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {TypeService} from '../model/TypeService';
import {Country} from '../model/Country';
import {City} from '../model/City';
import {Region} from '../model/Region';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.css']
})
export class AddAnnouncementComponent implements OnInit {
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  public typeServices: TypeService[] = [
    {
      id: 1,
      nameEN: 'Type Service 1',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 2,
      nameEN: 'Type Service 2',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 3,
      nameEN: 'Type Service 3',
      createdAt: '',
      updatedAt: '',
      description: ''
    }
  ];
  public selectedTypeServices = 1;

  public countrys: Country[] = [
    {
      id: 1,
      name: 'Abkhazia',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 2,
      name: 'Afghanistan',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 3,
      name: 'Albania',
      createdAt: '',
      updatedAt: '',
      description: ''
    }
  ];
  public selectedCountrys = 1;
  public citys: City[] = [
    {
      id: 1,
      name: 'City 1',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 2,
      name: 'City 2',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 3,
      name: 'City 3',
      createdAt: '',
      updatedAt: '',
      description: ''
    }
  ];
  public selectedCity = 1;
  public regions: Region[] = [
    {
      id: 1,
      name: 'Region 1',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 2,
      name: 'Region 2',
      createdAt: '',
      updatedAt: '',
      description: ''
    },
    {
      id: 3,
      name: 'Region 3',
      createdAt: '',
      updatedAt: '',
      description: ''
    }
  ];
  public selectedRegion = 1;
  settingsFrm: FormGroup;

  constructor(private sessionService: SessionService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.settingsFrm = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required])
    });
    if (this.sessionService.IsAuthenticatedPage('AddAnnouncement')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }

  StartPage() {
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    console.log(fd);
  }
}
