import React from "react";

export default function Backup() {
  return (
    <table className="table">
      <tr className="tr-top">
        <th className="font">Course</th>
        <th className="font">
          Automatic System-Timeout Period for Jobs in (days)
        </th>
        <th className="font">Applicant Multiplayer Ratio</th>
        <th className="font">Auto Approval</th>
      </tr>
      {finalData ? (
        finalData.map((finalData) => {
          return (
            <tr key={finalData.courseId} className="tr-bot">
              <td className="font td1">{finalData.courseName}</td>
              <td className="td2">
                <div className="td2-background">
                  <div className="td2-div">
                    {/* <input onChange={(e) => this.changeRatio(e, finalData.courseId)} className="td2-div-input" type="number" min="0" value={finalData.ratio}>
                    </input> */}
                    <input
                      className="td2-div-input"
                      type="number"
                      min="0"
                    ></input>
                  </div>
                </div>
              </td>
              <td className="td2">
                <div className="td2-background">
                  <div className="td2-div">
                    <input
                      onChange={(e) => this.changeRatio(e, finalData.courseId)}
                      className="td2-div-input"
                      type="number"
                      min="0"
                      value={finalData.ratio}
                    ></input>
                  </div>
                </div>
              </td>
              <td className="checkbox td3">
                <div className="div-apple-switch">
                  <input
                    class="apple-switch"
                    type="checkbox"
                    defaultChecked={finalData.autoApprovalJob}
                    onChange={(e) =>
                      this.changeAutoApprovalJob(e, finalData.courseId)
                    }
                  />
                  <label>
                    {finalData.autoApprovalJob === true ? "Yes" : "No"}
                  </label>
                </div>
              </td>
            </tr>
          );
        })
      ) : (
        <div></div>
      )}
    </table>
  );
}
