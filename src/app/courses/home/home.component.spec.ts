import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";
import { skip } from "rxjs/operators";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.query(By.css(".mat-tab-label-content"));
    console.log(tabs.nativeElement.textContent);

    expect(tabs.nativeElement.textContent).toBe(
      "Beginners",
      "Unexpected tab found"
    );
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Expected to find 2 tabs");
  });

  it("should display advanced courses when tab clicked", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);

    fixture.detectChanges();
    const cardTitles = el.queryAll(
      By.css(".mat-tab-body-active .mat-card-title")
    );

    console.log(cardTitles);

    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");

    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  });

  //#region async test

  it("should display advanced courses when tab clicked - setTimeout", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);

    fixture.detectChanges();
    setTimeout(() => {
      const cardTitles = el.queryAll(
        By.css(".mat-tab-body-active .mat-card-title")
      );

      console.log(cardTitles);

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    }, 500);
  });

  it("should display advanced courses when tab clicked - done", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);

    fixture.detectChanges();
    setTimeout(() => {
      const cardTitles = el.queryAll(
        By.css(".mat-tab-body-active .mat-card-title")
      );

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
      done();
    }, 500);
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(
      By.css(".mat-tab-body-active .mat-card-title")
    );

    console.log(cardTitles);

    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");

    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);

    fixture.detectChanges();

    // callback once async operations are completed
    fixture.whenStable().then(() => {
      console.log("called whenStable() ");

      const cardTitles = el.queryAll(
        By.css(".mat-tab-body-active .mat-card-title")
      );

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    });
  }));

  //#endregion
});
