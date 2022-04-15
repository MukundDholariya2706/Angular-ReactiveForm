import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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

  constructor() {}

  ngOnInit() {
    this.registerform = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      address: new FormGroup({
        street: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        zipcode: new FormControl(null, [ Validators.required, Validators.minLength(2),
        ]),
      }),
      email: new FormControl(null, [ Validators.required, Validators.email ]),
      imageInput: new FormControl(null, [ Validators.required ]),
    });
  }

  onImagChangeFromFile($event:any){
    if($event.target.files && $event.target.files[0]){
      let file = $event.target.files[0];
      console.log(file);
      if(file.type == "image/png"){
        console.log("correct")
      }
      else{
        // validation error
        this.registerform.controls['imageInput'].reset();
        this.registerform.controls['imageInput'].setValidators([Validators.required]);
        this.registerform.get('imageInput')?.updateValueAndValidity();
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    if(this.registerform.invalid){
      return;
    }

    if(this.submitted){
      console.log(this.registerform.value);
      alert("Form Submitted Successfully");
    }
  }
}
