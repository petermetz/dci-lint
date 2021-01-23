import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { LintGitRepoPageRoutingModule } from "./lint-git-repo-routing.module";

import { LintGitRepoPage } from "./lint-git-repo.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LintGitRepoPageRoutingModule,
  ],
  declarations: [LintGitRepoPage],
})
export class LintGitRepoPageModule {}
