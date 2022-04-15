import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from './confirmed.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  registerform!: FormGroup;
  submitted = false;
  title = 'Angular-ReactiveForm';

  get f() {
    return this.registerform.controls;
  }

  get g() {
    return (this.registerform.controls['address'] as FormGroup).controls;
  }

  constructor(private bd: FormBuilder) {}

  ngOnInit() {
    this.registerform = this.bd.group(
      {
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        address: this.bd.group({
          street: ['', [Validators.required]],
          city: ['', [Validators.required]],
          zipcode: ['', [Validators.required,Validators.minLength(2)]],
        }),
        email: ['', [Validators.required, Validators.email]],
        imageInput: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
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
      alert('Form Submitted Successfully');
    }
  }

  // image upload validation

  onImagChangeFromFile($event: any) {
    if ($event.target.files && $event.target.files[0]) {
      let file = $event.target.files[0];
      console.log(file);
      if (file.type == 'image/png') {
        console.log('correct');
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
}
