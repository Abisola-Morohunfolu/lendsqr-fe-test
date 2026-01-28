import type { IUser } from '@/types/user.types.ts'
import styles from '../UserDetails.module.scss'

interface GeneralDetailsTabProps {
  user: IUser
}

const GeneralDetailsTab: React.FC<GeneralDetailsTabProps> = ({ user }) => (
  <div className={styles.contentCard}>
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>Personal Information</h3>
      <div className={styles.dataGrid}>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>FULL NAME</p>
          <p className={styles.dataValue}>{user.fullName}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>PHONE NUMBER</p>
          <p className={styles.dataValue}>{user.phoneNumber}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>EMAIL ADDRESS</p>
          <p className={styles.dataValue}>{user.personalInfo.email}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>BVN</p>
          <p className={styles.dataValue}>{user.bvn}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>GENDER</p>
          <p className={styles.dataValue}>{user.personalInfo.gender}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>MARITAL STATUS</p>
          <p className={styles.dataValue}>{user.personalInfo.maritalStatus}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>CHILDREN</p>
          <p className={styles.dataValue}>{user.personalInfo.children}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>TYPE OF RESIDENCE</p>
          <p className={styles.dataValue}>{user.personalInfo.typeOfResidence}</p>
        </div>
      </div>
    </section>

    <section className={styles.block}>
      <h3 className={styles.blockTitle}>Education and Employment</h3>
      <div className={`${styles.dataGrid} ${styles.dataGridFourCol}`}>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>LEVEL OF EDUCATION</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.levelOfEducation}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>EMPLOYMENT STATUS</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.employmentStatus}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>SECTOR OF EMPLOYMENT</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.sectorOfEmployment}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>DURATION OF EMPLOYMENT</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.durationOfEmployment}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>OFFICE EMAIL</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.officeEmail}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>MONTHLY INCOME</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.monthlyIncome}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>LOAN REPAYMENT</p>
          <p className={styles.dataValue}>{user.educationAndEmployment.loanRepayment}</p>
        </div>
      </div>
    </section>

    <section className={styles.block}>
      <h3 className={styles.blockTitle}>Socials</h3>
      <div className={`${styles.dataGrid} ${styles.dataGridNarrow}`}>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>TWITTER</p>
          <p className={styles.dataValue}>{user.personalInfo.twitter}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>FACEBOOK</p>
          <p className={styles.dataValue}>{user.personalInfo.facebook}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataLabel}>INSTAGRAM</p>
          <p className={styles.dataValue}>{user.personalInfo.instagram}</p>
        </div>
      </div>
    </section>

    {user.guarantors.map((guarantor, index) => (
      <section key={guarantor.fullName} className={styles.block}>
        <h3 className={styles.blockTitle}>Guarantor {index + 1}</h3>
        <div className={`${styles.dataGrid} ${styles.dataGridNarrow}`}>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>FULL NAME</p>
            <p className={styles.dataValue}>{guarantor.fullName}</p>
          </div>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>PHONE NUMBER</p>
            <p className={styles.dataValue}>{guarantor.phoneNumber}</p>
          </div>
          {guarantor.email && (
            <div className={styles.dataField}>
              <p className={styles.dataLabel}>EMAIL ADDRESS</p>
              <p className={styles.dataValue}>{guarantor.email}</p>
            </div>
          )}
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>RELATIONSHIP</p>
            <p className={styles.dataValue}>{guarantor.relationship}</p>
          </div>
        </div>
      </section>
    ))}
  </div>
)

export default GeneralDetailsTab
