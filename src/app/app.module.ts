import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { DiagramModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';
import { ContextMenuModule, MenuModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { DropDownListModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, RadioButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { NumericTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, Slider } from '@syncfusion/ej2-angular-inputs';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,RouterOutlet,DiagramModule,SymbolPaletteAllModule,ToolbarModule,ButtonModule,DropDownButtonModule,
    ContextMenuModule,CheckBoxModule,ButtonModule,DropDownListModule,DialogModule,NumericTextBoxModule,ColorPickerModule,
    SliderModule,RadioButtonModule,UploaderModule,MenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
