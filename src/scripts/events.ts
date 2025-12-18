import { AnnotationAlignment, Connector, ConnectorModel, ContextMenuItemModel, Diagram, DiagramBeforeMenuOpenEventArgs, HorizontalAlignment, IDragEnterEventArgs, IRotationEventArgs, ISelectionChangeEventArgs, ISizeChangeEventArgs, NodeConstraints, NodeModel, PathAnnotationModel, SelectorModel, ShapeAnnotationModel, TextAlign, TextStyleModel, VerticalAlignment } from "@syncfusion/ej2-angular-diagrams";
import { PathAnnotation, ShapeAnnotation } from '@syncfusion/ej2-diagrams'
import { NodeProperties, SelectorViewModel } from "./selector";
import { ChangeArgs as ButtonChangeArgs, ChangeEventArgs as CheckBoxChangeEventArgs, } from '@syncfusion/ej2-buttons'
import { ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
import { ColorPickerEventArgs } from "@syncfusion/ej2-angular-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { ChangeEventArgs as DropDownChangeEventArgs } from "@syncfusion/ej2-dropdowns"
import { ClickEventArgs as ToolbarClickEventArgs } from "@syncfusion/ej2-navigations"


export class DiagramClientSideEvents {

    private selectedItem: SelectorViewModel;
    public ddlTextPosition!: DropDownListComponent;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;

    }
    public drawingNode: any;
    public selectionChange(args: ISelectionChangeEventArgs): void {
        if (args.state === 'Changed') {
            let diagram = this.selectedItem.diagram;
            let toolbarObj = this.selectedItem.toolbarObj;
            var multiSelect;
            var selectedItems = (diagram as any).selectedItems.nodes;
            selectedItems = selectedItems.concat((diagram as any).selectedItems.connectors as Object[]);
            this.selectedItem.utilityMethods.enableToolbarItems(selectedItems);
            let nodeContainer: HTMLElement  = (document.getElementById("nodePropertyContainer") as any);
            (nodeContainer as HTMLElement).classList.remove('multiple');
            (nodeContainer as HTMLElement).classList.remove('connector');
            if (selectedItems.length > 1) {
                multiSelect = true;
                this.multipleSelectionSettings(selectedItems as Object[]);
                (toolbarObj as any).items[7].tooltipText = 'Group';
                (toolbarObj as any).items[7].prefixIcon = 'sf-icon-group';
                for (var i = 7; i <= 25; i++) {
                    (toolbarObj as any).items[i].visible = true;
                }
            }
            else if (selectedItems.length === 1) {
                multiSelect = false;

                this.singleSelectionSettings(selectedItems[0] as Object[]);
                for (var i = 7; i <= 25; i++) {
                    if (i <= 16) {
                        (toolbarObj as any).items[i].visible = false;
                    }
                    else {
                        (toolbarObj as any).items[i].visible = true;

                    }
                }
                if (selectedItems[0].children && selectedItems[0].children.length > 0) {
                    (toolbarObj as any).items[7].tooltipText = 'UnGroup';
                    (toolbarObj as any).items[7].prefixIcon = 'sf-icon-ungroup';
                    (toolbarObj as any).items[7].visible = true;
                }
            }
            else {
                this.objectTypeChange('diagram');
                for (var i = 7; i <= 25; i++) {
                    (toolbarObj as any).items[i].visible = false;
                }
            }
        }
    };
    public multipleSelectionSettings(selectedItems: Object[]): void {
        this.objectTypeChange('None');
        let showConnectorPanel: boolean = false, showNodePanel: boolean = false;
        let showTextPanel: boolean = false, showConTextPanel: boolean = false;
        let nodeContainer: HTMLElement | null = document.getElementById('nodePropertyContainer');
        for (let i: number = 0; i < selectedItems.length; i++) {
            let object: Object = selectedItems[i];
            if ((object as ConnectorModel).type === undefined && (!showNodePanel || !showTextPanel)) {
                showNodePanel = true;
                showTextPanel = (object as any).annotations.length > 0 && (object as any).annotations[0].content ? true : false;
            } else if ((object as ConnectorModel).type !== undefined && (!showConnectorPanel || !showConTextPanel)) {
                showConnectorPanel = true;
                showConTextPanel = (object as any).annotations.length > 0 && (object as any).annotations[0].content ? true : false;
            }
        }
        let selectItem1: SelectorModel = (this.selectedItem as any).diagram.selectedItems;
        if (showNodePanel) {
            (nodeContainer as any).style.display = '';
            (nodeContainer as any).classList.add('multiple');
            if (showConnectorPanel) {
                (nodeContainer as any).classList.add('connector');
            }
            this.selectedItem.utilityMethods.bindNodeProperties((selectItem1 as any).nodes[0], this.selectedItem);
        }
        if (showConnectorPanel && !showNodePanel) {
            (document.getElementById('connectorPropertyContainer') as any).style.display = '';
            this.selectedItem.utilityMethods.bindConnectorProperties((selectItem1 as any).connectors[0], this.selectedItem);
        }
        if (showTextPanel || showConTextPanel) {
            (document.getElementById('textPropertyContainer') as any).style.display = '';
            if (showTextPanel && showConTextPanel) {
                (document.getElementById('textPositionDiv')as any).style.display = 'none';
                (document.getElementById('textColorDiv') as any).className = 'col-xs-6 db-col-left';
            } else {
                (document.getElementById('textPositionDiv') as any).style.display = '';
                (document.getElementById('textColorDiv') as any).className = 'col-xs-6 db-col-right';
                if (showConTextPanel) {
                    this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getConnectorTextPositions();
                  
                } else {
                    this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getNodeTextPositions();
                
                }
                this.ddlTextPosition.dataBind();
            }
        }
    };
    public singleSelectionSettings(selectedObject: Object): void {
        let object: NodeModel | ConnectorModel;
        if ((selectedObject as Connector).type === undefined) {
            this.objectTypeChange('node');
            object = selectedObject as NodeModel;
            this.selectedItem.utilityMethods.bindNodeProperties((object as any), this.selectedItem);
        } else {
            this.objectTypeChange('connector');
            object = selectedObject as Connector;
            this.selectedItem.utilityMethods.bindConnectorProperties((object as any), this.selectedItem);
        }
        if ((object as any).shape && (object as any).shape.type === 'Text') {
            (document.getElementById('textPropertyContainer') as any).style.display = '';
            (document.getElementById('toolbarTextAlignmentDiv') as any).style.display = 'none';
           (document.getElementById('textPositionDiv') as any).style.display = 'none';
            (document.getElementById('textColorDiv') as any).className = 'col-xs-6 db-col-left';
           // Disable opacity slider and text input
            const opacitySlider = document.getElementById('textOpacityProperty');
            if (opacitySlider) {
                opacitySlider.style.visibility = 'hidden';
            }
            this.selectedItem.utilityMethods.bindTextProperties((object as any).style, this.selectedItem);
        } else if ((object as any).annotations.length > 0 && (object as any).annotations[0].content) {
            (document.getElementById('textPropertyContainer') as any).style.display = '';
            let annotation: ShapeAnnotation | PathAnnotation;
            (document.getElementById('toolbarTextAlignmentDiv') as any).style.display = '';
            (document.getElementById('textPositionDiv') as any).style.display = '';
            (document.getElementById('textColorDiv') as any).className = 'col-xs-6 db-col-right';
            // Reset opacity controls for non-text nodes
            const opacitySlider = document.getElementById('textOpacityProperty');
            if (opacitySlider) {
                opacitySlider.style.visibility = 'visible';
            }
            this.selectedItem.utilityMethods.bindTextProperties((object as any).annotations[0].style, this.selectedItem);
            this.selectedItem.utilityMethods.updateHorVertAlign((object as any).annotations[0].horizontalAlignment, (object as any).annotations[0].verticalAlignment);
            if ((object as any).annotations[0] instanceof ShapeAnnotation) {
                annotation = (object as any).annotations[0] as ShapeAnnotation;
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getNodeTextPositions();
                this.ddlTextPosition.value = (this.selectedItem as any).textProperties.textPosition = null;
                this.ddlTextPosition.dataBind();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = this.selectedItem.utilityMethods.getPosition(annotation.offset);
                this.ddlTextPosition.dataBind();
            } else if ((object as any).annotations[0] instanceof PathAnnotation) {
                annotation = (object as any).annotations[0] as PathAnnotation;
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getConnectorTextPositions();
                this.ddlTextPosition.value = (this.selectedItem as any).textProperties.textPosition = null;
                this.ddlTextPosition.dataBind();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = annotation.alignment;
                this.ddlTextPosition.dataBind();
            }
        }

    };
    public sizeChange(args: ISizeChangeEventArgs) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.width = (Math.round((args as any).newValue.width * 100) / 100);
        this.selectedItem.nodeProperties.height = (Math.round((args as any).newValue.height * 100) / 100);
        if (args.state === 'Completed') {
            this.selectedItem.isModified = true;
            this.selectedItem.preventPropertyChange = false;
        }
    };
    public rotateChange(args: IRotationEventArgs) {
        let diagram = this.selectedItem.diagram as Diagram;
        if ((diagram as any).selectedItems.nodes.concat(diagram.selectedItems.connectors as object).length === 1) {
            (this.selectedItem as any).nodeProperties.rotateAngle = args.newValue ? args.newValue.rotateAngle : (diagram as any).selectedItems.nodes.concat(diagram.selectedItems.connectors as object)[0].rotateAngle;
        }
    };
    public positionChange(args: any) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.offsetX = (Math.round(args.newValue.offsetX * 100) / 100);
        this.selectedItem.nodeProperties.offsetY = (Math.round(args.newValue.offsetY * 100) / 100);
        if (args.state === 'Completed') {
            this.selectedItem.isModified = true;
            this.selectedItem.preventPropertyChange = false;
        }
    };
    public collectionChange(args: ISelectionChangeEventArgs): void {
        if (args.state === 'Changed') {
            this.selectedItem.isModified = true;
        }
    }
    public dragEnter(args: IDragEnterEventArgs): void {
        let obj: NodeModel = args.element as NodeModel;
        obj.constraints = NodeConstraints.Default;
        if ((obj as any).id.indexOf('Door_close') !== -1) {
            obj.width = 40;
            obj.height = 42;
        }
        else if ((obj as any).id.indexOf('Double_door_close') !== -1) {
            obj.width = 80;
            obj.height = 42;
        }
        else if ((obj as any).id.indexOf('Circle_Dining_Table') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if ((obj as any).id.indexOf('Circle_Study_Table') !== -1 || (obj as any).id.indexOf('Circle_Study_Table1') !== -1 || (obj as any).id.indexOf('Circle_Study_Table2') !== -1 || (obj as any).id.indexOf('Circle_Study_Table3') !== -1) {
            obj.width = 40;
            obj.height = 40;
        }
        else if ((obj as any).id.indexOf('Rectangle_Dining_Table') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if ((obj as any).id.indexOf('Oblong_Dining_Table') !== -1 || (obj as any).id.indexOf('Oval_Dining_Table') !== -1) {
            obj.width = 90;
            obj.height = 50;
        }
        else if ((obj as any).id.indexOf('Rectangular_Table_for_Two') !== -1 || (obj as any).id.indexOf('Circular_Table_for_Two') !== -1) {
            obj.width = 50;
            obj.height = 60;
        }
        else if ((obj as any).id.indexOf('Rectangle_Study_Table') !== -1 || (obj as any).id.indexOf('Rectangle_Study_Table1') !== -1) {
            obj.width = 80;
            obj.height = 40;
        }
        else if ((obj as any).id.indexOf('Refrigerator') !== -1) {
            obj.width = 52;
            obj.height = 60;
        }
        else if ((obj as any).id.indexOf('Stool') !== -1) {
            obj.width = 23;
            obj.height = 23;
        }
        else if ((obj as any).id.indexOf('Wall_Corner') !== -1 || (obj as any).id.indexOf('Wall_Corner1') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if ((obj as any).id.indexOf('Water_Cooler') !== -1 || (obj as any).id.indexOf('Elevator') !== -1) {
            obj.width = 40;
            obj.height = 40;
        }
        else if ((obj as any).id.indexOf('Chair1') !== -1) {
            obj.width = 25;
            obj.height = 25;
        }
        else if ((obj as any).id.indexOf('Chair') !== -1 || (obj as any).id.indexOf('Large_Plant') !== -1) {
            obj.width = 28;
            obj.height = 32;
        }
        else if ((obj as any).id.indexOf('Double_bed') !== -1 || (obj as any).id.indexOf('Double_bed1') !== -1) {
            obj.width = 100;
            obj.height = 90;
        }
        else if ((obj as any).id.indexOf('Single_bed') !== -1 || (obj as any).id.indexOf('Single_bed1') !== -1) {
            obj.width = 50;
            obj.height = 90;
        }
        else if ((obj as any).id.indexOf('Book_Case') !== -1) {
            obj.width = 60;
            obj.height = 20;
        }
        else if ((obj as any).id.indexOf('Warddrobe') !== -1 || (obj as any).id.indexOf('Warddrobe1') !== -1) {
            obj.width = 73;
            obj.height = 35;
        }
        else if ((obj as any).id.indexOf('Small_Plant') !== -1 || (obj as any).id.indexOf('Lamp_light') !== -1) {
            obj.width = 25;
            obj.height = 25;
        }
        else if ((obj as any).id.indexOf('Matte') !== -1 || (obj as any).id.indexOf('Matte1') !== -1) {
            obj.width = 40;
            obj.height = 20;
        }
        else if ((obj as any).id.indexOf('Flat_TV') !== -1 || (obj as any).id.indexOf('Flat_TV1') !== -1) {
            obj.width = 68;
            obj.height = 10;
        }
        else if ((obj as any).id.indexOf('TV') !== -1) {
            obj.width = 40;
            obj.height = 25;
        }
        else if ((obj as any).id.indexOf('Single_Sofa') !== -1 || (obj as any).id.indexOf('Couch') !== -1) {
            obj.width = 45;
            obj.height = 40;
        }
        else if ((obj as any).id.indexOf('Sofa') !== -1 || (obj as any).id.indexOf('Double_Sofa') !== -1 || (obj as any).id.indexOf('Lounge') !== -1) {
            obj.width = 100;
            obj.height = 35;
        }
        else if ((obj as any).id.indexOf('Window_Garden') !== -1) {
            obj.width = 80;
            obj.height = 18;
        }
        else if ((obj as any).id.indexOf('Small_Gas_Range') !== -1) {
            obj.width = 70;
            obj.height = 32;
        }
        else if ((obj as any).id.indexOf('Large_Gas_Range') !== -1 || (obj as any).id.indexOf('Large_Gas_Range1') !== -1) {
            obj.width = 100;
            obj.height = 32;
        }
        else if ((obj as any).id.indexOf('Window') !== -1 || (obj as any).id.indexOf('window1') !== -1) {
            obj.width = 50;
            obj.height = 6;
        }

        else if ((obj as any).id.indexOf('Piano') !== -1) {
            obj.width = 68;
            obj.height = 71;
        }
        else if ((obj as any).id.indexOf('Staircase') !== -1 || (obj as any).id.indexOf('Staircase1') !== -1 || (obj as any).id.indexOf('Staircase2') !== -1) {
            obj.width = 150;
            obj.height = 50;
        }
        else if ((obj as any).id.indexOf('Printer') !== -1 || (obj as any).id.indexOf('Laptop') !== -1) {
            obj.width = 30;
            obj.height = 30;
        }
        else if ((obj as any).id.indexOf('Room') !== -1 || (obj as any).id.indexOf('T_Room') !== -1 || (obj as any).id.indexOf('L_Room') !== -1 || (obj as any).id.indexOf('T_Wall') !== -1) {
            obj.width = 100;
            obj.height = 100;
        }
        else if ((obj as any).id.indexOf('Double_Sink') !== -1 || (obj as any).id.indexOf('Double_Sink1') !== -1 || (obj as any).id.indexOf('Double_Sink2') !== -1 || (obj as any).id.indexOf('Double_Sink4') !== -1) {
            obj.width = 76;
            obj.height = 38;
        }
        else if ((obj as any).id.indexOf('Toilet1') !== -1 || (obj as any).id.indexOf('Toilet2') !== -1) {
            obj.width = 23;
            obj.height = 36;
        }
        else if ((obj as any).id.indexOf('Corner_Shower') !== -1 || (obj as any).id.indexOf('Shower') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if ((obj as any).id.indexOf('Wash_Basin1') !== -1 || (obj as any).id.indexOf('Wash_Basin2') !== -1 || (obj as any).id.indexOf('Wash_Basin3') !== -1 || (obj as any).id.indexOf('Wash_Basin5') !== -1 || (obj as any).id.indexOf('Wash_Basin6') !== -1) {
            obj.width = 35;
            obj.height = 30;
        }
        else if ((obj as any).id.indexOf('Bath_Tub') !== -1 || (obj as any).id.indexOf('Bath_Tub1') !== -1 || (obj as any).id.indexOf('Bath_Tub2') !== -1 || (obj as any).id.indexOf('Bath_Tub3') !== -1) {
            obj.width = 55;
            obj.height = 30;
        }
        else {
            obj.width = 50;
            obj.height = 50;
        }

    }
    public objectTypeChange(objectType: string): void {
        (document.getElementById('diagramPropertyContainer') as any).style.display = 'none';
        (document.getElementById('nodePropertyContainer') as any).style.display = 'none';
        (document.getElementById('textPropertyContainer') as any).style.display = 'none';
        (document.getElementById('connectorPropertyContainer') as any).style.display = 'none';
        switch (objectType) {
            case 'diagram':
                (document.getElementById('diagramPropertyContainer') as any).style.display = '';
                break;
            case 'node':
                (document.getElementById('nodePropertyContainer') as any).style.display = '';
                break;
            case 'connector':
                (document.getElementById('connectorPropertyContainer') as any).style.display = '';
                break;
        }
    };
    public historyChange() {
        let diagram = this.selectedItem.diagram as Diagram;
        let toolbarContainer: HTMLDivElement = document.getElementsByClassName('db-toolbar-container')[0] as HTMLDivElement;
        toolbarContainer.classList.remove('db-undo');
        toolbarContainer.classList.remove('db-redo');
        if ((diagram as any).historyManager.undoStack.length > 0) {
            toolbarContainer.classList.add('db-undo');
        }
        if ((diagram as any).historyManager.redoStack.length > 0) {
            toolbarContainer.classList.add('db-redo');
        }
        this.selectedItem.utilityMethods.viewSelectionChange(diagram, this.selectedItem.showPageBreak);
    };
    public diagramClear() {
        (this.selectedItem as any).diagram.clear();
    }

}

export class DiagramPropertyBinding {
    private selectedItem: SelectorViewModel;
    private nodeProperties: NodeProperties;
    constructor(selectedItem: SelectorViewModel, nodeProperties: NodeProperties) {
        this.selectedItem = selectedItem;
        this.nodeProperties = nodeProperties;
    }
    public pageOrientationChange(args: any): void {
        if (args.target) {
            var target = args.target;
            let designContextMenu = (document.getElementById('diagram-menu') as any).ej2_instances[0];
            let diagram = this.selectedItem.diagram as Diagram;
            var items = designContextMenu.items[3].items;
            var option = target.id ? target.id : (args.currentTarget.ej2_instances[0].iconCss === 'sf-icon-portrait' ? 'pagePortrait' : 'pageLandscape');
            switch (option) {
                case 'pagePortrait':
                    diagram.pageSettings.orientation = 'Portrait';
                    items[0].items[0].iconCss = '';
                    items[0].items[1].iconCss = 'sf-icon-check-tick';
                    (document.getElementById('pageLandscape') as any).classList.remove('e-active');
                    break;
                case 'pageLandscape':
                    diagram.pageSettings.orientation = 'Landscape';
                    items[0].items[0].iconCss = 'sf-icon-check-tick';
                    items[0].items[1].iconCss = '';
                    (document.getElementById('pagePortrait') as any).classList.remove('e-active');
                    break;
            }
            diagram.dataBind();
        }
    };
    public pageDimensionChange(args: NumericChangeEventArgs | any): void {
        if (args.event) {
            let pageWidth: number = Number(this.selectedItem.pageSettings.pageWidth);
            let pageHeight: number = Number(this.selectedItem.pageSettings.pageHeight);
            let target: HTMLInputElement = args.event.target as HTMLInputElement;
            if (target.tagName.toLowerCase() === 'span') {
                target = (target as any).parentElement.children[0] as HTMLInputElement;
            }
            let diagram: Diagram = this.selectedItem.diagram as Diagram;
            if (target.id === 'numerictextbox_0') {
                pageWidth = parseInt(target.value.split(',').join(''), 10);
            } else {
                pageHeight = parseInt(target.value.replace(/,/g, ''), 10);
            }
            if (pageWidth && pageHeight) {
                if (pageWidth > pageHeight) {
                    this.selectedItem.pageSettings.isPortrait = false;
                    this.selectedItem.pageSettings.isLandscape = true;
                    diagram.pageSettings.orientation = 'Landscape';
                } else {
                    this.selectedItem.pageSettings.isPortrait = true;
                    this.selectedItem.pageSettings.isLandscape = false;
                    diagram.pageSettings.orientation = 'Portrait';
                }
                this.selectedItem.pageSettings.pageWidth = diagram.pageSettings.width = pageWidth;
                this.selectedItem.pageSettings.pageHeight = diagram.pageSettings.height = pageHeight;
                diagram.dataBind();
            }
        }
    };
    public pageBackgroundChange1(args: ColorPickerEventArgs | any): void {
        if (args.currentValue) {
            let diagram: Diagram | undefined= this.selectedItem.diagram;
            (diagram as any).pageSettings.background = {
                color: args.currentValue.rgba
            };
            (diagram as any).dataBind();
        }
    };
    public pageBreaksChange(args: CheckBoxChangeEventArgs): void {
        const btnViewMenu = (document.getElementById('diagram-menu') as any).ej2_instances[0];
        const items = btnViewMenu.items[4].items;
        if (args.event) {
            (this.selectedItem as any).pageSettings.pageBreaks = args.checked;
            (this.selectedItem as any).diagram.pageSettings.showPageBreaks = args.checked;
            items[5].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
        }
    };
    public paperListChange(args: any) {
        (document.getElementById('pageDimension') as any).style.display = 'none';
        (document.getElementById('pageOrientation') as any).style.display = '';
        let diagram = this.selectedItem.diagram;
        var value = args.value || args.item.value;
        var paperSize = this.selectedItem.utilityMethods.getPaperSize(value);
        var pageWidth = paperSize.pageWidth;
        var pageHeight = paperSize.pageHeight;
        if (pageWidth && pageHeight) {
            if ((diagram as any).pageSettings.orientation === 'Portrait') {
                if (pageWidth > pageHeight) {
                    var temp = pageWidth;
                    pageWidth = pageHeight;
                    pageHeight = temp;
                }
            }
            else {
                if (pageHeight > pageWidth) {
                    var temp = pageHeight;
                    pageHeight = pageWidth;
                    pageWidth = temp;
                }
            }
            (diagram as any).pageSettings.width = pageWidth;
            (diagram as any).pageSettings.height = pageHeight;
        }
        else {
            (document.getElementById('pageOrientation') as any).style.display = 'none';
            (document.getElementById('pageDimension') as any).style.display = '';
            (diagram as any).pageSettings.width = 1460;
            (diagram as any).pageSettings.height = 600;
        }
        let designContextMenu = (document.getElementById('designContextMenu') as any).ej2_instances[0];
        this.updatePaperSelection(designContextMenu.items[1], args.value);
        (diagram as any).dataBind();
    };
    public updatePaperSelection(items: ContextMenuItemModel, value: string) {
        for (let i: number = 0; i < (items as any).items.length; i++) {
            if (value === ((items as any).items[i] as any).value) {
                (items as any).items[i].iconCss = 'sf-icon-check-tick';
            }
            else {
                (items as any).items[i].iconCss = '';
            }
        }
    };

    public textPropertyChange(propertyName: string, propertyValue: Object): void {
        if (!this.selectedItem.preventPropertyChange) {
            let diagram: Diagram = this.selectedItem.diagram as Diagram;
            let selectedObjects: Object[] = diagram.selectedItems.nodes as object[];
            selectedObjects = selectedObjects.concat((diagram as any).selectedItems.connectors);
            propertyName = propertyName.toLowerCase();
            if (selectedObjects.length > 0) {
                for (let i: number = 0; i < selectedObjects.length; i++) {
                    let node: Object = selectedObjects[i];
                    if ((node as ConnectorModel).type ===undefined || (node as ConnectorModel).type !==undefined) {
                        if ((node as any).annotations.length > 0) {
                            for (let j: number = 0; j < (node as any).annotations.length; j++) {
                                let annotation: ShapeAnnotationModel | PathAnnotationModel | undefined;
                                if ((node as any).annotations[j] instanceof ShapeAnnotation) {
                                    annotation = (node as any).annotations[j] as ShapeAnnotationModel;
                                    if (propertyName === 'textposition') {
                                        this.selectedItem.textProperties.textPosition = propertyValue.toString();
                                        annotation.offset = this.selectedItem.utilityMethods.getOffset(propertyValue as string);
                                    }
                                } else if ((node as any).annotations[j] instanceof PathAnnotation) {
                                    annotation = (node as any).annotations[j] as PathAnnotationModel;
                                    if (propertyName === 'textposition') {
                                        this.selectedItem.textProperties.textPosition = propertyValue.toString();
                                        annotation.alignment = this.selectedItem.textProperties.textPosition as AnnotationAlignment;
                                    }
                                }
                                if (annotation) {
                                    if (propertyName === 'left' || propertyName === 'right' || propertyName === 'center') {
                                        annotation.horizontalAlignment = propertyValue as HorizontalAlignment;
                                        this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, (annotation as any).verticalAlignment);
                                    } else if (propertyName === 'top' || propertyName === 'bottom') {
                                        annotation.verticalAlignment = propertyValue as VerticalAlignment;
                                        this.selectedItem.utilityMethods.updateHorVertAlign((annotation as any).horizontalAlignment, annotation.verticalAlignment);
                                    } else if (propertyName === 'middle') {
                                        annotation.verticalAlignment = 'Center';
                                        this.selectedItem.utilityMethods.updateHorVertAlign((annotation as any).horizontalAlignment, annotation.verticalAlignment);
                                    } else {
                                        this.updateTextProperties(propertyName, propertyValue, (annotation as any).style);
                                    }
                                }
                            }
                        } else if ((node as NodeModel).shape && (node as any).shape.type === 'Text') {
                            this.updateTextProperties(propertyName, propertyValue, (node as any).style);
                        }
                    }
                }
                diagram.dataBind();
                this.selectedItem.isModified = true;
            }
        }
    };

    public toolbarTextStyleChange(args: ToolbarClickEventArgs): void {
        this.textPropertyChange((args as any).item.tooltipText, false);
    };
    public toolbarTextSubAlignChange(args: ToolbarClickEventArgs): void {
        let propertyName: string = (args as any).item.tooltipText.replace(/[' ']/g, '');
        this.textPropertyChange(propertyName, propertyName);
    };
    public toolbarTextAlignChange(args: ToolbarClickEventArgs): void {
        let propertyName: string = (args as any).item.tooltipText.replace('Align ', '');
        if (propertyName === 'Top') {
            propertyName = 'Bottom';
        }
        else if (propertyName === 'Bottom') {
            propertyName = 'Top';
        }
        this.textPropertyChange(propertyName, propertyName);
    }
    public textPositionChange(args: DropDownChangeEventArgs): void {
        if (args.value !== null) {
            this.textPropertyChange('textPosition', args.value);
        }
    }
    public updateTextProperties(propertyName: string, propertyValue: Object, annotation: TextStyleModel): void {
        switch (propertyName) {
            case 'bold':
                annotation.bold = !annotation.bold;
                this.updateToolbarState('toolbarTextStyle', annotation.bold, 0);
                break;
            case 'italic':
                annotation.italic = !annotation.italic;
                this.updateToolbarState('toolbarTextStyle', annotation.italic, 1);
                break;
            case 'underline':
                this.selectedItem.textProperties.textDecoration = !this.selectedItem.textProperties.textDecoration;
                annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
                let dec = annotation.textDecoration === 'Underline' ? true : false
                this.updateToolbarState('toolbarTextStyle', dec, 2);
                break;
            case 'aligntextleft':
            case 'aligntextright':
            case 'aligntextcenter':
                annotation.textAlign = propertyValue.toString().replace('AlignText', '') as TextAlign;
                this.selectedItem.utilityMethods.updateTextAlign(annotation.textAlign);
                break;
        }
    };
    public updateToolbarState(toolbarName: string, isSelected: boolean, index: number) {
        let toolbarTextStyle: any = document.getElementById(toolbarName);
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
        }
        if (toolbarTextStyle) {
            let cssClass: string = toolbarTextStyle.items[index].cssClass;
            toolbarTextStyle.items[index].cssClass = isSelected ? cssClass + ' tb-item-selected' : cssClass.replace(' tb-item-selected', '');
            toolbarTextStyle.dataBind();
        }
    };
    public download(filename: string) {
        this.selectedItem.utilityMethods.download((this.selectedItem as any).diagram.saveDiagram(), filename);
    }
}
