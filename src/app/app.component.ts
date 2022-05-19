import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfirmedValidator } from './validator/confirmed.validator';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  registerform!: FormGroup;
  submitted = false;
  title = 'Angular-ReactiveForm';
  url_reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  email_reg = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  password_reg = '(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}';
  numNotAllowReg = '^[a-zA-Z \-\']+';
  imageSrc!: any;

  Data: Array<any> = [
    { name: 'Pear', value: 'pear' },
    { name: 'Plum', value: 'plum' },
    { name: 'Kiwi', value: 'kiwi' },
    { name: 'Apple', value: 'apple' },
    { name: 'Lime', value: 'lime' },
  ];
  base64Data: any;

  get f() {
    return this.registerform.controls;
  }

  get g() {
    return (this.registerform.controls['address'] as FormGroup).controls;
  }

  get controls() {
    return (this.registerform.get('hobbies') as FormArray).controls;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerform = this.fb.group(
      {
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required, Validators.pattern(this.numNotAllowReg)]],
        gender: ['', Validators.required],
        address: this.fb.group({
          street: ['', [Validators.required]],
          city: ['', [Validators.required]],
          zipcode: ['', [Validators.required,Validators.minLength(2)]],
        }),
        email: ['', [Validators.required, Validators.email], this.forbiddenEmails],
        // email: ['', [Validators.required, Validators.pattern(this.email_reg)]],
        imageInput: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern(this.password_reg)]],
        confirm_password: ['', [Validators.required]],
        url: ['', [Validators.required, Validators.pattern(this.url_reg)]],
        hobbies: this.fb.array([]),
        acceptTerms: [false, Validators.requiredTrue],
        checkArray: this.fb.array([],[Validators.required]),
      },
      { validator: ConfirmedValidator('password', 'confirm_password')}
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerform.invalid) {
      return;
    }

    if (this.submitted) {
      console.log(this.registerform.value);
      console.log(this.registerform);
      // alert('Form Submitted Successfully');
    }
  }

  onReset(){
    this.submitted = false;
    this.imageSrc = null;
    this.registerform.reset();
  }

  // image upload validation

  onImagChangeFromFile($event: any) {
    if ($event.target.files && $event.target.files[0]) {
      let file = $event.target.files[0];
      // console.log(file);
      if (file.type == 'image/png') {
        console.log('correct');
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(file);
      } else {
        // validation error
        this.registerform.controls['imageInput'].reset();
        this.registerform.controls['imageInput'].setValidators([
          Validators.required,
        ]);
        this.registerform.get('imageInput')?.updateValueAndValidity();
      }
    }
  }

  onAddHobby(){
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.registerform.get('hobbies')).push(control)
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.registerform.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any>{
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
