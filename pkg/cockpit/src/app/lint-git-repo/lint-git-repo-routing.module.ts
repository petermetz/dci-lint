import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LintGitRepoPage } from "./lint-git-repo.page";

const routes: Routes = [
  {
    path: "",
    component: LintGitRepoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LintGitRepoPageRoutingModule {}
