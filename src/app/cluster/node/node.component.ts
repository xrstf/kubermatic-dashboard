import { Component, OnInit, Input} from "@angular/core";
import { NodeEntity } from "../../api/entitiy/NodeEntity";
import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import {NodeDeleteConfirmationComponent} from "../node-delete-confirmation/node-delete-confirmation.component";

@Component({
  selector: "kubermatic-node",
  templateUrl: "node.component.html",
  styleUrls: ["node.component.scss"]
})

export class NodeComponent implements OnInit {
  @Input() node: NodeEntity;
  @Input() clusterName: string;
  @Input() seedDcName: string;
  @Input() nodeProvider: string;
  @Input() index: number;
  public conditionsMessage: string = "";

  // public dialogRef: MdDialogRef<NodeDeleteConfirmationComponent>;

  public config: MdDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      width: '',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        message: 'Jazzy jazz jazz'
      }
  };

  constructor(public dialog: MdDialog) {}

  ngOnInit() {

  }

  public deleteNodeDialog(): void {
    let dialogRef = this.dialog.open(NodeDeleteConfirmationComponent, this.config);
    dialogRef.componentInstance.nodeName = this.node.metadata.name;
    dialogRef.componentInstance.nodeUID = this.node.metadata.uid;
    dialogRef.componentInstance.clusterName = this.clusterName;
    dialogRef.componentInstance.seedDcName = this.seedDcName;

    //this.data = this.dialogRef.componentInstance;

    dialogRef.afterClosed().subscribe(result => {
      // this.dialogRef = null;
    });
  }




  public getNodeHealth() {
    let green = "fa fa-circle green";
    let red = "fa fa-circle-o red";
    let orange = "fa fa-spin fa-circle-o-notch orange";
    let orangeSpinner = "fa fa-spin fa-circle-o-notch orange";

    if(this.node.status.conditions) {
      this.conditionsMessage = "";
      for (let entry of this.node.status.conditions) {
        if (entry.status == "True" && entry.type != "Ready"){
            this.conditionsMessage = this.conditionsMessage + entry.type + ': ' + entry.message + ' ';
        }
      }
    }


    if (this.node.metadata.annotations['node.k8s.io/state'] && !this.conditionsMessage.length) {
      switch (this.node.metadata.annotations['node.k8s.io/state']) {
        case "pending":
          return orange;
        case "provisioning":
          return orangeSpinner;
        case "launching":
          return orangeSpinner;
        case "running":
          return green;
        default:
          return red;
      }
    } else {
      return red;
    }
  }
}

